const { connection } = require("../../createConnection");

const SELECT_ORDERS = function (MYSQL_CONTENT) {
  return new Promise((resove, reject) => {
    MYSQL_CONTENT.query("SELECT * FROM orders", (error, results, fields) => {
      if (error) throw error;
      resove(results);
      console.log("The solution is: ", results);
    });
  });
};

const SELECT_ORDERS_LIMITS = function (
  MYSQL_CONTENT,
  param = { page: 1, pageSize: 10 }
) {
  let { page, pageSize } = param;
  page = parseInt(page);
  pageSize = parseInt(pageSize);
  const offset = (page - 1) * pageSize; // 计算偏移量
  return new Promise((resove, reject) => {
    MYSQL_CONTENT.query(
      "SELECT * FROM orders LIMIT ? OFFSET ?",
      [pageSize, offset],
      (err, rows) => {
        if (err) throw err;
        resove(rows);
      }
    );
  });
};

const CREATE_USERS = function (username, password) {
  const uuid = `${Math.random().toString(36).substring(2, 10)}-${Math.random()
    .toString(36)
    .substring(2, 6)}-${Math.random()
    .toString(36)
    .substring(2, 6)}-${Math.random()
    .toString(36)
    .substring(2, 6)}-${Math.random().toString(36).substring(2, 14)}`;

  const query = `INSERT INTO user (username, password, uuid) VALUES ('${username}', '${password}', '${uuid}')`;
  return new Promise((resove, reject) => {
    connection.query(query, function (error, results, fields) {
      if (error) {
        reject(error);
        throw error;
      }
      resove(results);
    });
  });
};

// 同时查询账号和密码
const USERS_VALIDATION = function (username, password) {
  const query = `SELECT id, username, password, uuid, created_at, updated_at
  FROM photo.user WHERE username = '${username}' LIMIT 1;`;
  return new Promise((resove, reject) => {
    connection.query(query, function (error, results, fields) {
      if (error) {
        reject(error);
        throw error;
      }
      console.log('查询到的',results)
      resove(results);
    });
  });
};

module.exports = {
  SELECT_ORDERS,
  SELECT_ORDERS_LIMITS,
  CREATE_USERS,
  USERS_VALIDATION,
};
