const Router = require("koa-router");
const componentRouter = new Router();

componentRouter.get("/component", (ctx, next) => {
  // ctx.router available
  ctx.body = "hi commopone";
});

module.exports = {
  componentRouter,
};
