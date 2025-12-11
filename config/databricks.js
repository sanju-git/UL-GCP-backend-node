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


async function getGoogleIDToken(audience) {
  const auth = new GoogleAuth();
  // This will use ADC (no key file needed)
  const client = await auth.getIdTokenClient(audience);
  const headers = await client.getRequestHeaders();
  // The token is in the Authorization header
  let authHeader = headers.get("authorization")
  return authHeader.replace("Bearer ", "");
}


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
  const idToken = await getGoogleIDToken(process.env.DATABRICKS_HOST);
 
  const response = await fetch(`${process.env.DATABRICKS_HOST}/api/2.1/jobs/run-now`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${idToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      job_id: Number(process.env.DATABRICKS_JOB_ID)
    })
  });

  console.log(response)

  if (!response.ok) {
    throw new Error(`Databricks API error: ${response.statusText}`);
  }

  return response.json();
}

module.exports = { getDBXClient, triggerDatabricksJob };
