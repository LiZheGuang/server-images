// utils 封装一些常用的方法
const { connection } = require("../../createConnection");

// 公用查询分页方法
const SELECT_SQL_LIMITS = function (SELECT_NAME, query) {
  if (query) {
    var { page, pageSize } = query;
  }
  if (!query || !page || !pageSize) {
    return new Promise((resove, reject) => {
      connection.query(`SELECT * FROM ${SELECT_NAME}`, (err, rows) => {
        if (err) throw err;
        resove(rows);
      });
    });
  } else {
    console.log("query-else");

    page = parseInt(page);
    pageSize = parseInt(pageSize);
    const offset = (page - 1) * pageSize; // 计算偏移量
    return new Promise((resove, reject) => {
      connection.query(
        `SELECT * FROM ${SELECT_NAME} LIMIT ? OFFSET ?`,
        [pageSize, offset],
        (err, rows) => {
          if (err) throw err;
          resove(rows);
        }
      );
    });
  }
};

// 查询某个表达内的id详情
const SELECT_SQL_DETAIL_ID = function (id) {
  return new Promise((resove, reject) => {
    connection.query(`SELECT * FROM user WHERE id = ${id};`, (err, body) => {
      if (err) reject(err);
      resove(body);
    });
  });
};

// 把MYSQL返回的数组变成对象
class Super_Utils {
  static SQL_TO_OBJECT(results) {
    const data = results.reduce((obj, row) => {
      obj = Object.assign({}, row);
      return obj;
    }, {});
    return data;
  }
  static SQL_JSONPARSE_DATA(results){
    return JSON.parse(JSON.stringify(results))
  }
}

module.exports = {
  SELECT_SQL_LIMITS,
  SELECT_SQL_DETAIL_ID,
  Super_Utils,
};
