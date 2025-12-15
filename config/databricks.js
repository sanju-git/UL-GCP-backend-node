const { GoogleAuth } = require("google-auth-library");
const databricks = require("@databricks/sql");
const fetch = require("node-fetch");

/**
 * Get a Google ID token for Databricks SQL connections.
 */
async function getGoogleIDToken(audience) {
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(audience);
  const headers = await client.getRequestHeaders();
  const authHeader = headers["authorization"] || headers.get("authorization");
  return authHeader.replace("Bearer ", "");
}

/**
 * Get a Google OAuth access token for Databricks REST API calls.
 */
async function getGoogleAccessToken() {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/cloud-platform"],
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

/**
 * Databricks SQL Client (uses ID token).
 */
let dbxClient = null;
async function getDBXClient() {
  if (!dbxClient) {
    const idToken = await getGoogleIDToken(process.env.DATABRICKS_HOST);
    dbxClient = new databricks.DBSQLClient();
    await dbxClient.connect({
      token: idToken,
      host: process.env.DATABRICKS_HOST_CON,
      path: process.env.DATABRICKS_HTTP_PATH,
      port: Number(process.env.DATABRICKS_PORT || 443),
    });
  }
  return dbxClient;
}


const DATABRICKS_HOST = process.env.DATABRICKS_HOST;
const CLIENT_ID = process.env.DATABRICKS_CLIENT_ID;
const CLIENT_SECRET = process.env.DATABRICKS_CLIENT_SECRET;
const JOB_ID = process.env.DATABRICKS_JOB_ID;

if (!DATABRICKS_HOST || !CLIENT_ID || !CLIENT_SECRET || !JOB_ID) {
  throw new Error("Missing required environment variables.");
}

const TOKEN_ENDPOINT = `${DATABRICKS_HOST}/oidc/v1/token`;

async function getDatabricksAccessToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const postData = new URLSearchParams({
    grant_type: 'client_credentials',
    scope: 'all-apis' 
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}` 
    },
    body: postData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Token response error body:", text); 
    throw new Error(`Failed to get token: ${response.status} - ${response.statusText}`);
  }

  const responseJson = await response.json();
  return responseJson.access_token;
}


async function triggerDatabricksJob() {
  try {
    const accessToken = await getDatabricksAccessToken();
    console.log('Access token obtained successfully.', accessToken);

    const jobRunUrl = `${DATABRICKS_HOST}/api/2.1/jobs/run-now`;
    const postData = JSON.stringify({
      job_id: parseInt(JOB_ID, 10),
    });

    const response = await fetch(jobRunUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
          'Content-Type': 'application/json',
        },
        body: postData,
    });


    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to trigger job: ${response.status} - ${text}`);
    }
    
    const responseJson = await response.json();
    console.log('Job triggered successfully. Run ID:', responseJson.run_id);
    return responseJson;

  } catch (error) {
    console.error('Error triggering Databricks job:', error.message);
    throw error; 
  }
}


module.exports = { getDBXClient, triggerDatabricksJob };
