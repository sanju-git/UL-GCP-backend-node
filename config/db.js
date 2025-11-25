const mysql = require("mysql2/promise");
const DB_HOST = "";
const DB_NAME = "";
const DB_USER = "";
const DB_PASS = "";

let pool;

const getPool = () => {
  if (pool) return pool;

  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✅ Direct MySQL Connection Pool Created (No IAM)");
  return pool;
};

module.exports = { getPool };
