const jwt = require("jsonwebtoken");
const { USERS_VALIDATION } = require("../mysql/order");
const secret = "TOP_SECRET";

function middleware(ctx, next) {
  ctx.state.user = "0x720eA831f6e3785e6d7975f546Bdd79B696937f5";
  return next(); // 调用下一个中间
}

async function verifyJwt(ctx, next) {
  const authHeader = ctx.request.headers.authorization; // 获取Authorization头部

  if (!authHeader) {
    ctx.throw(401, "Authorization header required");
  }

  const parts = authHeader.split(" ");
  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme)) {
    // 验证Bearer认证方案
    ctx.throw(401, "Invalid Authorization header format");
  }

  try {
    const decoded = jwt.verify(token, secret); // 验证JWT
    ctx.state.user = decoded;
    const { name, password } = decoded;
    console.log(decoded);
    const users = await USERS_VALIDATION(name, password);
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
      if (user_name != name || user_passsword != password) {
        ctx.body = {
          code: 401,
          message: "账号密码错误",
        };
        return;
      } else {
        ctx.state.user = res[0];
        return next(); // 调用下一个中间件
      }
    }
  } catch (err) {
    console.error(err);
    ctx.throw(401, err.message);
  }
}
module.exports = {
  Middleware: middleware,
  VerifyJwt: verifyJwt,
};
