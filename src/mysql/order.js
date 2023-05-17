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

module.exports = { SELECT_ORDERS, SELECT_ORDERS_LIMITS };
