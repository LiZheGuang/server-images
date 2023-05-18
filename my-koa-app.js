const Koa = require("koa");
const Router = require("koa-router");
const mysql = require("mysql");
const bodyParser = require("koa-bodyparser");
const cors = require('@koa/cors');

const { componentRouter } = require("./src/server/orders_all");
const { connection } = require("./createConnection");
const app = new Koa();
const router = new Router();
const { SELECT_ORDERS, SELECT_ORDERS_LIMITS } = require("./src/mysql/order");

router
  .get("/", (ctx, next) => {
    ctx.body = "Hello Koa";
  })
  .get("/about", (ctx, next) => {
    ctx.body = "About Us";
  })
  .get("/contact", (ctx, next) => {
    ctx.body = "Contact Us";
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
app.use(cors({
  credentials: true
}));

app
  .use(router.routes())
  .use(componentRouter.routes())
  .use(router.allowedMethods());
console.log("server=>  " + "http://localhost:8080");
app.listen(8080);
