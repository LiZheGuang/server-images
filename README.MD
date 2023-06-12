# SERVER-IMAGES SUPER DEMO

desc: koa koa-roter koa-body test 练习 Node 与 KOA 项目

## 实现的功能

- 路由 ✅
  - 路由模块化 ✅
- 数据库操作与链接 ✅
- koa-body ✅
- login ✅
- 创建用户表与用户信息 ✅
  - 用户信息以及 uuid ✅
- jwt 设计中间件进行校验
- 中间件 ✅
- view 文件支持 EJS 模板
- RBAC权限模型
  - role 角色 ✅
  - permission  权限 ✅
  - user_role 用户身份对应角色 ✅
  - role_permission  角色对应权限 ✅


## 用户身份权限API

/users  
用户列表
  ```json
  [
    {
        "id": 1,
        "userId": 1,
        "roleId": 1,
        "username": "admin1",
        "uuid": "4775b101-89c9-6704-66b5-fb5eba30c742",
        "role_name": "admin",
        "permissions": "1,2,3,4"
    }
  ] 
  ```
/users/:userid   

用户详情

```json
{
    "id": 1,
    "userId": 1,
    "roleId": 1,
    "username": "admin1",
    "uuid": "4775b101-89c9-6704-66b5-fb5eba30c742",
    "role_name": "admin",
    "permissions": "1,2,3,4",
    "permission_users": [
        {
            "id": 1,
            "name": "create",
            "description": "Can create new records"
        },
        {
            "id": 2,
            "name": "read",
            "description": "Can read existing records"
        },
        {
            "id": 3,
            "name": "update",
            "description": "Can update existing records"
        },
        {
            "id": 4,
            "name": "delete",
            "description": "Can delete existing records"
        }
    ]
}
```

POST:/addPerminssion 

@body:  
 * permissionName:String 
 * detail:String

增加权限

## JWT 中间件实现

可以使用 koa-router 库来构建路由，并为需要进行身份验证的路由应用中间件。以下是一个示例：

```js
const Koa = require("koa");
const Router = require("koa-router");
const jwt = require("jsonwebtoken");

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;
const secret = "my_secret"; // 密钥

function verifyJwt(ctx, next) {
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
    return next(); // 调用下一个中间件
  } catch (err) {
    console.error(err);
    ctx.throw(401, err.message);
  }
}

// 需要进行身份验证的路由
router.get("/profile", verifyJwt, async (ctx) => {
  ctx.body = { message: "Hello, " + ctx.state.user.name };
});

// 不需要进行身份验证的路由
router.get("/public", async (ctx) => {
  ctx.body = { message: "This is a public page" };
});

app.use(router.routes());
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
```

在这个示例中，首先定义了一个名为 verifyJwt 的中间件函数用于身份验证，然后使用 koa-router 中的.get 方法定义了两个路由：一个需要进行身份验证，一个不需要进行身份验证。
需要进行身份验证的路由使用了 verifyJwt 中间件进行身份验证。不需要进行身份验证的路由没有使用任何中间件。
将路由添加到路由器后，使用 app.use(router.routes())将路由器添加到应用中。
需要注意的是，koa-router 库提供了更强大的路由功能，你可以根据自己的需求进行路由的定义和使用。同时，建议将密钥存储在配置文件或环境变量中，以避免硬编码敏感信息。
