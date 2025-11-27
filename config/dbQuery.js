// const { getPool } = require("./db");

// async function query(sql, params = []) {
//   const pool = getPool();
//   const [rows] = await pool.execute(sql, params);
//   return rows;
// }

// module.exports = { query };


// const { getPool } = require("./db");

// async function query(sqlQuery) {
//   const pool = await getPool();
//   const result = await pool.request().query(sqlQuery);
//   return result.recordset;
// }


const { getPool } = require("./db");

async function query(sqlQuery, params = {}) {
  const pool = await getPool();
  const request = pool.request();

  for (const key in params) {
    request.input(key, params[key]);
  }

  const result = await request.query(sqlQuery);
  return result.recordset;
}


module.exports = { query };
