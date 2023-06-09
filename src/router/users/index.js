/**
 * @role  身份
 * @permission 权限
 */
const Router = require("koa-router");
const { SELECT_SQL_LIMITS } = require("../../mysql/utils");

const {
  QUERY_USER_ROLE,
  QUERY_USER_LIST,
  CREQTE_PERMISSION,
  ROLE_QULER_PERMISSION,
  CREATE_ROLE_PERMISSION,
} = require("../../mysql/order");
const users = new Router({
  prefix: "/users",
});

users.get("/", async (ctx, next) => {
  ctx.body = await QUERY_USER_LIST(ctx.query);
});

// 查询detail_users
users.get("/detail/:userid", async (ctx, next) => {
  const { userid } = ctx.params; // 从路由参数中获取 id
  try {
    let body = await QUERY_USER_ROLE(userid);
    ctx.body = body;
  } catch (err) {
    ctx.body = {
      msg: "未查询到该用户",
    };
  }
});

// role 用户身份
users.get("/role", async (ctx) => {
  ctx.body = await SELECT_SQL_LIMITS("role", ctx.query);
});
// permission 权限
users.get("/permission", async (ctx) => {
  ctx.body = await SELECT_SQL_LIMITS("permission", ctx.query);
});
// role_permission  身份对应权限
users.get("/role_permission", async (ctx) => {
  ctx.body = await SELECT_SQL_LIMITS("role_permission", ctx.query);
});
// user_role  用户对应身份
users.get("/userRole", async (ctx) => {
  const { roleId } = ctx.query;
  console.log(roleId,'roleId')
  if (roleId) {
    ctx.body = await ROLE_QULER_PERMISSION(roleId);
  } else {
    ctx.body = await ROLE_QULER_PERMISSION();
  }
});

// 创建身份与权限
users.post("/createRole", async (ctx) => {
  const { name, msg, permission } = ctx.request.body;

  await CREATE_ROLE_PERMISSION({ name, msg, permission });
  ctx.body = {
    msg: "创建成功",
    code: 200,
  };
});

// 增加角色对应权限
users.post("/addRolePerminssion", (ctx) => {
  ctx.body = "addRolePerminssion";
});

// 增加权限
users.post("/addPerminssion", async (ctx) => {
  const { permissionName, detail } = ctx.request.body;
  ctx.body = await CREQTE_PERMISSION(permissionName, detail);
});

// user
module.exports = {
  users,
};
