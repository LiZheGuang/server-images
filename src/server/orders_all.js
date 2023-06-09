const Router = require("koa-router");
const jwt = require("jsonwebtoken");
const { CREATE_USERS, USERS_VALIDATION } = require("../mysql/order");
const { VerifyJwt } = require("./middleware");

const componentRouter = new Router({
  prefix: "/component",
});

componentRouter.get("/", VerifyJwt, (ctx, next) => {
  // ctx.router available
  ctx.body = "hi commopone" + JSON.stringify(ctx.state.user);
});
// 用户身份呢交易
componentRouter.post("/login", async (ctx, next) => {
  // 获取 post 请求的参数
  const { username, password } = ctx.request.body;
  const users = await USERS_VALIDATION(username, password);
  const res = JSON.parse(JSON.stringify(users));
  const len = res.length;
  if (!len) {
    ctx.body = {
      code: 401,
      message: "查询不到此用户",
    };
    return;
  } else {
    const user_name = res[0].username;
    const user_passsword = res[0].password;
    if (user_name != username || user_passsword != password) {
      ctx.body = {
        code: 401,
        message: "账号密码错误",
      };
      return;
    } else {
      const token = jwt.sign(
        { name: username, password: password },
        "TOP_SECRET"
      );
      ctx.body = { code: 200, message: "登录成功", token };
      return;
    }
  }
});

componentRouter.get("/jwt", (ctx, next) => {
  const token = jwt.sign(
    { name: "zheguang", password: "a7161089" },
    "TOP_SECRET"
  );
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
