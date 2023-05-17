const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "7161089",
  database: "photo",
});

module.exports = {
  connection,
};
