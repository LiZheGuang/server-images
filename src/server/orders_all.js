const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const { CREATE_USERS } = require("../mysql/order");
const componentRouter = new Router({
  prefix: "/component",
});

componentRouter.get("/", (ctx, next) => {
  // ctx.router available
  ctx.body = "hi commopone";
});
componentRouter.post("/login", (ctx, next) => {
  // 获取 post 请求的参数
  const { username, password } = ctx.request.body;

  // 在实际应用中，这里应该从数据库中查询用户数据，并进行密码比对
  if (username === "admin" && password === "123456") {
    ctx.body = { success: true, message: "登录成功！" };
  } else {
    ctx.body = { success: false, message: "用户名或密码错误！" };
  }
});

componentRouter.get("/jwt", (ctx, next) => {
  const token = jwt.sign({ name: "zhaiguang" }, "TOP_SECRET");
  ctx.body = {
    code: 200,
    token: token,
  };
});

// 解析jwt
componentRouter.get("/jwtdecode", (ctx, next) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemhhaWd1YW5nIiwiaWF0IjoxNjg0MzI3NzYxfQ.ZPIyHWfgHs44HgrNlwyVZu_NNGpSjLD11NSv4Do3kTs";
  const decoded = jwt.verify(token, "TOP_SECRET");
  ctx.body = {
    code: 200,
    decoded,
  };
});

// 创建

componentRouter.post("/createUser", async (ctx, next) => {
  // 创建users
  // 获取 post 请求的参数

  const { username, password } = ctx.request.body;
  if (username && password) {
    try {
      await CREATE_USERS(username, password);
      ctx.body = {
        code: 200,
        message: "创建成功",
      };
    } catch (err) {
      ctx.body = err;
    }
  } else {
    ctx.body = {
      code: 400,
      message: "请传递正确的参数",
    };
  }
});

module.exports = {
  componentRouter,
};
