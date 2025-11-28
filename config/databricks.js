const databricks = require("@databricks/sql");

let dbxSession = null;

async function getDBXSession() {
  if (!dbxSession) {
    dbxSession = databricks.connect({
      serverHostname: process.env.DATABRICKS_HOST,
      httpPath: process.env.DATABRICKS_HTTP_PATH,
      accessToken: process.env.DATABRICKS_TOKEN
    });
  }
  return dbxSession;
}

module.exports = { getDBXSession };


