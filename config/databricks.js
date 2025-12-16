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

async function triggerDatabricksJob() {
  const accessToken = await getGoogleIDToken(process.env.DATABRICKS_HOST);
 
  const response = await fetch(`${process.env.DATABRICKS_HOST}/api/2.1/jobs/run-now`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      job_id: Number(process.env.DATABRICKS_JOB_ID),
    }),
  });
 
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Databricks API error: ${response.statusText} - ${text}`);
  }
 
  return response.json();
}


module.exports = { getDBXClient, triggerDatabricksJob };
