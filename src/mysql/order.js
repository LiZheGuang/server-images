const { connection } = require("../../createConnection");
const { Super_Utils, SELECT_SQL_LIMITS } = require("../mysql/utils");

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
      console.log("查询到的", results);
      resove(results);
    });
  });
};

// 查询用户权限与角色权限 - detail
const QUERY_USER_ROLE = async function (userId) {
  console.log(userId);
  const query = `SELECT user.id, user_role.userId, user_role.roleId, username, uuid ,role.name as 'role_name', GROUP_CONCAT(permissionId) AS permissions 
  FROM user 
  INNER JOIN user_role 
  ON user.id = user_role.userId 
  INNER JOIN role 
  ON role.id = user_role.roleId 
  INNER JOIN role_permission 
  ON role_permission.roleId  = role.id 
  WHERE user.id  = ${userId}
  GROUP BY user.id, user_role.userId, user_role.roleId, username, uuid, role_name;`;
  let user_role = Super_Utils.SQL_JSONPARSE_DATA(await createPromise(query))[0];
  let { permissions } = user_role;
  const permissions_arr = [...permissions.split(",")];

  let permission = Super_Utils.SQL_JSONPARSE_DATA(
    await SELECT_SQL_LIMITS("permission")
  );

  let permission_arrs = [];

  // 过滤身份权限
  for (let i = 0; i < permissions_arr.length; i++) {
    let permissions_id = Number(permissions_arr[i]);
    permission_arrs.push(
      permission.filter((item) => item.id === permissions_id)[0]
    );
  }
  user_role.permission_users = permission_arrs;

  return user_role;
};

// 用户列表
const QUERY_USER_LIST = async function (PARAM_QUERY) {
  function SQL_QUER_STRING(PARAM_QUERY) {
    console.log(PARAM_QUERY);
    const { id, uid } = PARAM_QUERY;
    let str = ` WHERE user.id `;
    if (id) {
      str = `
      WHERE user.id  = ${id}
      `;
    }
    if (uid) {
      str = `
      WHERE user.uid  = ${uid}
      `;
    }
    return `SELECT user.id, user_role.userId, user_role.roleId, username, uuid ,user.created_at,user.updated_at,role.name as 'role_name', GROUP_CONCAT(permissionId) AS permissions 
    FROM user 
    LEFT JOIN user_role 
    ON user.id = user_role.userId 
    LEFT JOIN role 
    ON role.id = user_role.roleId 
    LEFT JOIN role_permission 
    ON role_permission.roleId  = role.id 
    ${str}
    GROUP BY user.id, user_role.userId, user_role.roleId, username, uuid, role_name;`;
  }

  let user_role = Super_Utils.SQL_JSONPARSE_DATA(
    await createPromise(SQL_QUER_STRING(PARAM_QUERY))
  );
  return user_role;
};

// 增加权限
const CREQTE_PERMISSION = async function (permissionName, detail) {
  console.log(permissionName);
  console.log(detail);
  if (!permissionName || !detail) return { msg: "缺少依赖参数" };
  const SQL_QUERY = `INSERT INTO permission (name,description) VALUES 
  ('${permissionName}','${detail}')`;
  console.log(SQL_QUERY);
  try {
    await createPromise(SQL_QUERY);
    return { msg: "创建成功" };
  } catch (err) {
    return { msg: "创建失败" };
  }
};

// 通过用户身份查询对应权限
const ROLE_QULER_PERMISSION = async function (roleId) {

  const SQL_STRING = `SELECT role.id as roleId,role.name ,role.msg,GROUP_CONCAT(role_permission.permissionId) AS permissions
  FROM role
  LEFT JOIN role_permission ON role.id = role_permission.roleId 
  WHERE role.id ${roleId ?  '=' + roleId :''}
  GROUP BY role.id;`;
  let response = Super_Utils.SQL_JSONPARSE_DATA(
    await createPromise(SQL_STRING)
  );
  return response;
};

// 创建身份与权限
const CREATE_ROLE_PERMISSION = async ({ name, msg, permission }) => {
  const SQL_CREATE_ROLE = `INSERT INTO role (name,msg) VALUES 
  ('${name}','${name}')`;

  // 首先创建用户身份
  let create_role_response = Super_Utils.SQL_JSONPARSE_DATA(
    await createPromise(SQL_CREATE_ROLE)
  );
  if (create_role_response.insertId) {
    // 创建用户身份的ID
    let roleid = create_role_response.insertId;
    // 创建用户身份后 根据用户身份ID  - 在role_permisson 表里追加权限数据
    // [1, 2, 3, 4, 9, 19, 21, 22, 23, 24, 25]
    let str = ``;
    for (let i = 0; i < permission.length; i++) {
      const permissionId = permission[i];
      if (i == permission.length - 1) {
        str += `(${roleid},${permissionId})`;
      } else {
        str += `(${roleid},${permissionId}),`;
      }
    }
    const SQL_STRING = `INSERT INTO role_permission (roleId,permissionId) VALUES 
      ${str} ;`;
    // console.log(str)
    // 新增 role_permission
    console.log(SQL_STRING);
    createPromise(SQL_STRING);
  }
};


function createPromise(sql_string) {
  return new Promise((resove, reject) => {
    connection.query(sql_string, (err, body) => {
      if (err) {
        reject(err);
        console.log("报错报错");
      }
      resove(body);
    });
  });
}

module.exports = {
  SELECT_ORDERS,
  SELECT_ORDERS_LIMITS,
  CREATE_USERS,
  USERS_VALIDATION,
  QUERY_USER_ROLE,
  QUERY_USER_LIST,
  CREQTE_PERMISSION,
  ROLE_QULER_PERMISSION,
  CREATE_ROLE_PERMISSION,
};
