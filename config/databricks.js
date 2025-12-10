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

const { GoogleAuth } = require("google-auth-library");
const databricks = require("@databricks/sql");

async function getGoogleIDToken(audience) {
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(audience);
  const headers = await client.getRequestHeaders();
  return headers["Authorization"].replace("Bearer ", "");
}

let dbxClient = null;

async function getDBXClient() {
  if (!dbxClient) {
    const idToken = await getGoogleIDToken(process.env.DATABRICKS_HOST);

    dbxClient = new databricks.DBSQLClient();
    await dbxClient.connect({
      token: idToken,                               
      host: process.env.DATABRICKS_HOST,
      path: process.env.DATABRICKS_HTTP_PATH,
      port: Number(process.env.DATABRICKS_PORT || 443),
    });
  }
  return dbxClient;
}

module.exports = { getDBXClient };
