const sql = require("mssql");

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server:process.env.DB_HOST,
      database: process.env.DB_NAME,
      port:Number(process.env.DB_PORT),
      options: {
        trustServerCertificate: true,
        encrypt: true
      }
    });
  }
  return pool;
}

module.exports = { getPool };



