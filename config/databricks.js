const databricks = require("@databricks/sql");
let dbxSession = null;
async function getDBXSession() {
  if (!dbxSession) {
    // This is the correct way for your installed version
    dbxSession = new databricks.DBSQLClient();
    await dbxSession.connect({
      token: process.env.DATABRICKS_TOKEN,
      host: process.env.DATABRICKS_HOST,
      path: process.env.DATABRICKS_HTTP_PATH
    });
  }
  return dbxSession;
}

module.exports = { getDBXSession };

