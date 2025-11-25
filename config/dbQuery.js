const { getPool } = require("./db");

async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

module.exports = { query };
