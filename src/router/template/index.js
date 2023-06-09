const Router = require("koa-router");

const path = require("path");
const template = new Router({
  prefix: "/template",
});

template.get("/", async (ctx, next) => {
  await ctx.render("health/index", {
    title: "Welcome to My Site",
    content: "Hello, world!",
  });
});
module.exports = {
  template,
};
