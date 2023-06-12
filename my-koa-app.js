const Koa = require("koa");
const Router = require("koa-router");
const mysql = require("mysql");
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const views = require("koa-views");
const path = require("path");
const serve = require("koa-static");
const { componentRouter } = require("./src/server/orders_all");
const { connection } = require("./createConnection");
const { Middleware } = require("./src/server/middleware");
const { template } = require("./src/router/template/index");
const { users } = require("./src/router/users/index");
const app = new Koa();
const router = new Router();
const { SELECT_ORDERS, SELECT_ORDERS_LIMITS } = require("./src/mysql/order");
// 设置静态资源的路径

app.use(serve(path.join(__dirname, "public")));
app.use(
  views(path.join(__dirname, "/views"), {
    extension: "ejs",
  })
);

router
  .get("/", Middleware, (ctx, next) => {
    // ctx.body = "Hello Koa";
    ctx.body = { message: "Hello, " + ctx.state.user };
  })
  .get("/images", async (ctx, next) => {
    //  GET IMAGES
    ctx.response.set("Content-Type", "application/json");
    const RESPONE_ORDERS = await SELECT_ORDERS(connection);

    ctx.body = RESPONE_ORDERS;
  });

router.get("/images-limit", async (ctx, next) => {
  // GET FENYE
  let RESPONE_ORDERS;

  if (ctx.query) {
    // console.log(ctx.query);

    let { page, pageSize } = ctx.query;
    RESPONE_ORDERS = await SELECT_ORDERS_LIMITS(connection, {
      page,
      pageSize,
    });
  } else {
    RESPONE_ORDERS = await SELECT_ORDERS_LIMITS(connection);
  }
  ctx.response.set("Content-Type", "application/json");

  ctx.body = RESPONE_ORDERS;
});

app.use(bodyParser());

app.use(
  cors({
    credentials: true,
  })
);

app
  .use(router.routes())
  .use(componentRouter.routes())
  .use(template.routes())
  .use(users.routes())
  .use(router.allowedMethods());
console.log("server=>  " + "http://localhost:8080");
app.listen(8080);
