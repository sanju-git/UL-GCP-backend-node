// // const mysql = require("mysql2/promise");
// // const DB_HOST = "34.39.62.79";
// // const DB_NAME = "tg-sqlserver-dev-02";
// // const DB_USER = "ul-test-01";;
// // const DB_PASS = "GCPass3ssment";

// // let pool;

// // const getPool = () => {
// //   if (pool) return pool;

// //   pool = mysql.createPool({
// //     host: DB_HOST,
// //     user: DB_USER,
// //     password: DB_PASS,
// //     database: DB_NAME,
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     queueLimit: 0,
// //   });

// //   console.log("Direct MySQL Connection Pool Created (No IAM)");
// //   return pool;
// // };

// // async function testConnection() {
// //   try {
// //     const pool = getPool();
// //     const [rows] = await pool.query("SELECT 1 + 1 AS result");
// //     console.log("MySQL Connected Successfully! Test Result:", rows[0].result);
// //   } catch (error) {
// //     console.error("MySQL Connection Failed:", error.message);
// //   }
// // }

// // testConnection();

// // module.exports = { getPool };


const sql = require("mssql");

let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect({
      user: 'Demo',
      password: 'GCPass3ssment',
      server: '10.156.0.3',
      database: 'Demo',
      port: 1433,
      options: {
        trustServerCertificate: true,
        encrypt: true
      }
    });
  }
  return pool;
}

module.exports = { getPool };


// const { Connector } = require("@google-cloud/cloud-sql-connector");
// const sql = require("mssql");

// let pool;

// async function getPool() {
//   if (!pool) {
//     const connector = new Connector();

//     const options = await connector.getTediousOptions({
//       instanceConnectionName: "gcp-data-ai-architecture:europe-west2:tg-sqlserver-dev-02",
//       ipType: "PRIVATE",  // <── connect via private IP through secure tunnel
//     });

//     pool = await sql.connect({
//       ...options,
//       user: "ul-test-01",
//       password: "GCPass3ssment",
//       database: "demo",
//       options: { trustServerCertificate: true }
//     });
//   }
//   return pool;
// }

// module.exports = { getPool };

