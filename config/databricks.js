// const databricks = require("@databricks/sql");
// let dbxClient = null;

// async function getDBXClient() {
//   if (!dbxClient) {
//     // This is the correct way for your installed version
//     dbxClient = new databricks.DBSQLClient();
//     await dbxClient.connect({
//       token: process.env.DATABRICKS_TOKEN,
//       host: process.env.DATABRICKS_HOST,
//       path: process.env.DATABRICKS_HTTP_PATH,
//       port: Number(process.env.DATABRICKS_PORT || 443),
//     });
//   }
//   return dbxClient;
// }

// module.exports = { getDBXClient };


// const { GoogleAuth } = require("google-auth-library");
// const databricks = require("@databricks/sql");

// async function getGoogleIDToken(audience) {
//   const auth = new GoogleAuth();
//   const client = await auth.getClient();
//   const token = await client.fetchIdToken(audience);
//   return token; 
// }

// let dbxClient = null;

// async function getDBXClient() {
//   if (!dbxClient) {
//     const idToken = await getGoogleIDToken(process.env.DATABRICKS_HOST);

//     dbxClient = new databricks.DBSQLClient();
//     await dbxClient.connect({
//       token: idToken,
//       host: process.env.DATABRICKS_HOST,
//       path: process.env.DATABRICKS_HTTP_PATH,
//       port: Number(process.env.DATABRICKS_PORT || 443),
//     });
//   }
//   return dbxClient;
// }

// module.exports = { getDBXClient };


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

/**
 * Trigger a Databricks Job (uses access token).
 */
async function triggerDatabricksJob() {
  const accessToken = await getGoogleAccessToken();

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
  console.log("Response:", response);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Databricks API error: ${response.statusText} - ${text}`);
  }

  return response.json();
}

module.exports = { getDBXClient, triggerDatabricksJob };
