# 初始化项目

- `koa2 -e weibo-demo`
- `cd weibo-demo`
- `npm install`
- `npm install cross-env --save-dev`
- 修改环境参数配置
- 修改目录结构，将 `pubilc/`、`routes/`、`views/`、`app.js` 移动到 `src/` 中
- 修改 `bin/www` 中对 `app.js` 的引用路径
- `git init`
- `git remote add origin <SSH_URL>`
- `git pull origin master`

# MySQL

## 增删改查

```sql
insert into users () values ()   -- 增
delete from users where ()		-- 删
update users set name=''		-- 改
select * from users where ()	-- 查
```



## 分页

```sql
select * from users order by id desc limit 2 offset 2 -- 按id倒序排列，查2个，处于第2页
```



## 外键

- 创建外键
- 更新限制 & 删除级联
- 连表查询

### 创建外键

![](https://gitee.com/gainmore/imglib/raw/master/img/20210530151100.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210530151225.png)

选择 “CASCADE” 级联，当更新或删除某个数据时，会关联到有关系的表中的数据

### 连表查询

```sql
select * from blogs inner join users on users.id = blogs.userid

-- 可以加一些条件
select * from blogs inner join users on users.id = blogs.userid where users.username='zhangsan'

-- 连表查询不一定需要有外键
```



## Sequelize

- ORM - Object Relational Mapping
  - 数据表，用 JS 中的模型（class 或对象）代替
  - 一条或多条记录，用 JS 中一个对象或数组代替
  - sql 语句，用对象方法代替
- 建模（外键） & 同步到数据库
- 增删改查 & 连表查询

### 测试

- `npm install mysql2 sequelize`

- ```javascript
  const Sequelize = require('sequelize')
  
  const config = {
    host: 'localhost',
    dialect: 'mysql'
  }
  
  // 传入数据库名称，用户名，密码，配置
  const seq = new Sequelize('weibo-demo', 'root', '******', config)
  
  // 测试连接
  seq.authenticate().then(() => {
    console.log('ok');
  }).catch(() => {
    console.log('err');
  })
  ```

### 创建模型

1. `seq.js`

   ```javascript
   const Sequelize = require('sequelize')
   
   const config = {
     host: 'localhost',
     dialect: 'mysql'
   }
   
   // 传入数据库名称，用户名，密码，配置
   const seq = new Sequelize('weibo-demo', 'root', '******', config)
   
   // 测试连接
   seq.authenticate().then(() => {
     console.log('ok');
   }).catch(() => {
     console.log('err');
   })
   
   module.exports = seq
   ```

2. `model.js`

   ```javascript
   const Sequelize = require('sequelize')
   const seq = require('./seq')
   
   // 创建 User 模型，数据表的名字是 users
   const User = seq.define('user', {
     // id 会自动创建，并设为主键、自增
     // 自动创建 createdAt、updatedAt
     username: {
       type: Sequelize.STRING, // varchar(255)
       allowNull: false
     },
     password: {
       type: Sequelize.STRING,
       allowNull: false
     },
     nickname: {
       type: Sequelize.STRING
     }
   })
   
   module.exports = {
     User
   }
   ```

3. `sync.js`

   ```javascript
   const seq = require('./seq')
   
   require('./model')
   
   seq.sync({
     force: true // 当存在表时，强制覆盖
   }).then(() => {
     console.log('sync ok');
     process.exit()
   })
   ```

4. `nodemon sync.js`

### 插入数据

```javascript
const { User, Blog } = require('./model')

;(async () => {
  // 创建用户
  const zs = await User.create({
    username: 'zhangsan',
    password: '123',
    nickname: 'zs'
  })
  const ls = await User.create({
    username: 'lisi',
    password: '1234',
    nickname: 'ls'
  })
  const ww = await User.create({
    username: 'wangwu',
    password: '12345',
    nickname: 'ww'
  })
  // 获取用户id
  const zsId = zs.dataValues.id
  const lsId = ls.dataValues.id
  const wwId = ww.dataValues.id
  // 创建博客
  const blog1 = await Blog.create({
    title: 'fsdafs',
    content: 'fdsafsdfdsdsfgasdgd',
    userId: zsId
  })
  const blog2 = await Blog.create({
    title: 'fsdafs',
    content: 'fdsafsdfdsdsfgasdgd',
    userId: lsId
  })
  const blog3 = await Blog.create({
    title: 'fsdafs',
    content: 'fdsafsdfdsdsfgasdgd',
    userId: wwId
  })
})()
```

### 查询数据

```javascript
const { User, Blog } = require('./model');(async () => {  // 查询一条数据  const res1 = await User.findOne({    // 默认查询所有属性    where: {      username: 'zhangsan'    }  })  const res2 = await User.findOne({    where: {      username: 'zhangsan'    },    attributes: ['password', 'nickname'] // 查询部分属性  })  // 查询所有数据，分页  const res3 = await User.findAll({    where: {      username: 'zhangsan'    },    order: [      ['id', 'desc'], // id降序，password升序排列      ['password', 'asc']    ],    limit: 2, // 一页多少条数据    offset: 2 // 第几页  })  // 查询总数  const res4 = await User.findAndCountAll({    where: {      username: 'zhangsan'    },    order: [      ['id', 'desc'], // id降序，password升序排列      ['password', 'asc']    ],    limit: 2,    offset: 2  })  // 获取总的数量，不考虑分页  console.log(res4.count);  // 获取查询的结果  console.log(res4.rows.map(item => item.dataValues));})()
```

### 建立关联（详解）

两张表之间建立关联，会利用到两个方法：`belongsTo` 和 `hasMany`

顾名思义：

- `A.hasMany(B)` 表示 A 可用有多个 B，一对多的关系，比如一个用户可以有多篇博客：`User.hasMany(Blog)`
- `A.belongsTo(B)` 则表示 A 属于 B，和上面的刚好相反，表示多对一的关系，比如多篇博客属于同一个用户：`Blog.belongsTo(A)`

这两种方法从逻辑上理解完全相同，但应用的场景却不同。

比如，当需要从一个用户中连表查询所有博客时，就必须事先建立 `User.hasMany(Blog)` 的连接；相反，当需要从一篇博客中查询其作者的信息时，就必须事先建立 `Blog.belongsTo(User)` 的连接。

再来讲讲传入的一个参数 `foreignKey`，即外键的意思。

我们知道，两张要建立起关联，就必须要有某个字段相对应，这样才能将两张表彼此对应。

比如，要将 User 和 Blog 两张表关联，可以在 Blog 定义一个外键字段 userId，然后 `User.hasMany(Blog, { foreignKey: 'userId' })`，使得：`User.id --> Blog.userId`；

或者 `Blog.belongsTo(User, { foreignKey: 'userId' })`，使得： `Blog.userId --> User.id`；

注意，这里的 `foreignKey` 都是指的 `Blog` 里的字段，也就是说无论是 `hasMany` 还是 `belongsTo`，传入的 `foreignKey` 都是附属（这里`Blog`是附属方）一方的字段，然后指向主体的 `id`（这里主体是 `User`）。

### 连表查询

```javascript
  // 连表查询1  const res5 = await Blog.findAndCountAll({    order: [      ['id', 'desc']    ],    include: [      {        model: User,        attributes: ['username', 'nickname']      }    ]  })  console.log(res5.count);  console.log(res5.rows.map(item => {    const res = item.dataValues    res.user = item.dataValues.user.dataValues    return res  }));  // 连表查询2  const res6 = await User.findAndCountAll({    order: [      ['id', 'desc']    ],    include: [      {        model: Blog,        attributes: ['title', 'content']      }    ]  })  console.log(res6.count);  console.log(res6.rows.map(item => {    const res = item.dataValues    return res  }));
```

注意，要实现上面的两种方式的连表查询，必须要有如下设置：

```javascript
// 外键连接// 连表查询1的条件Blog.belongsTo(User, {  // 创建外键 Blog.userId => User.id  foreignKey: 'userId'})// 连表查询2的条件User.hasMany(Blog, {  foreignKey: 'userId'})
```

注意，一个用户可能有多个博客，而一个博客只对应一个用户，所以通过 user 查询到的 blogs 可能有多个，也可能一个都没有

### 更新数据

```javascript
const { User, Blog } = require('./model');(async () => {  const res = await Blog.update({    title: '标题1',    content: '内容1'  }, {    where: {      id: 1    }  })  console.log(res);})()
```



### 删除数据

```javascript
const { User, Blog } = require('./model');(async () => {  const res = await User.destroy({    where: {      id: 2    }  })  console.log(res);})()
```

注意，当删除 blogs 时可能会不成功，这时可以检查一下外键的设置

![image-20210530201903852](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20210530201903852.png)

变为 CASCADE 就能删除了

### 连接池

![](https://gitee.com/gainmore/imglib/raw/master/img/20210530202740.png)

线上环境使用连接池，比较稳定；

开发环境一般不使用连接池，因为比较难查 bug。

```javascript
const config = {  host: 'localhost',  dialect: 'mysql'}// 线上环境使用连接池config.pool = {  max: 5, // 连接池中最大的连接数量  min: 0, // 连接池中最小的连接数量  idle: 10000 // 如果一个连接池 10s 之内没有使用则释放}
```



# JWT

## jwt是什么

- json web token
- 用户认证成功之后，server 端返回一个加密的 token 给客户端
- 客户端后续每次请求都需要带 token，以示当前用户身份

## koa2实现jwt

1. 首先安装一款插件：`npm install koa-jwt`，用于统一管理多个路由的 token，比如设置哪些路由不用 token 验证，剩下的都需要 token 验证，否则会返回 401 状态码

   ```javascript
   // app.jsconst koaJwt = require('koa-jwt')const SECRET = '!#This_is_SECRET_KEY*' // 密钥...app.use(koaJwt({  secret: SECRET // 使用密钥解密token}).unless({  path: [/^\/users\/login/] // 自定义哪些路由忽略jwt验证}))...
   ```

2. 处理登录接口，当登录成功时，生成新的 token 并返回给客户端，登录失败，则直接返回登录失败

   ```javascript
   // routes/users.jsconst jwt = require('jsonwebtoken')const SECRET = '!#This_is_SECRET_KEY*'router.prefix('/users')router.post('/login', async (ctx, next) => {  const { username, password } = ctx.request.body // 获取请求体的用户名和密码  let userInfo, token  if (username === 'zhangsan' && password === 'fff') {    userInfo = {      username: 'zhangsan',      nickname: 'zs',      age: 18,      gender: 1    }  }  if (userInfo) {    // 用密钥将信息加密成token    token = jwt.sign(userInfo, SECRET, {      expiresIn: '1h' // 有效时间1h    })    ctx.body = {      errno: 0,      data: token    }    return  }  ctx.body = {    errno: -1,    message: '登录失败！'  }})
   ```

3. 此后，客户端每次请求都需要带上 token，将 token 放在请求头中，注意下面的格式：

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210531211639.png)

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210531211736.png)

4. 测试使用 token 获取用户信息

   ```javascript
   // routes/usersconst util = require('util')...const verify = util.promisify(jwt.verify) // 转为promise对象router.get('/zhangsan', async (ctx, next) => {  const token = ctx.header.authorization // 获取请求头中的token  try {    const payload = await verify(token.split(' ')[1], SECRET) // 解密    ctx.body = {      errno: 0,      userInfo: payload    }  } catch (e) {    ctx.body = {      errno: -1,      msg: 'token验证失败！'    }  }})...
   ```

   

## jwt对比session

- 都是为了解决：登录 和 存储登录用户的信息
- jwt 用户信息加密存储在客户端，不依赖 cookie，可跨域
- session 用户信息存储在服务端，依赖 cookie，默认不可跨域
- 一般情况下，两者都能满足，在大型系统中两者可共用
- jwt 更适合于服务节点较多，跨域较多的系统
- session 更适合统一的 web 服务，server 要严格管理用户信息

# 单元测试

- 单个功能或接口，给定输入，得到输出，看输出是否符合要求
- 需要手动编写用例代码，然后统一执行
- 意义：能一次性执行所有单测，短时间内验证所有功能是否正常

## 使用jest

- 测试文件的后缀必须是 `.test.js`
- 常用的断言
- 测试 http 接口



# 技术方案设计

- 架构设计
- 页面（模板，路由）和 API 设计
- 数据模型设计
- 其他
  - @ 功能如何实现？
  - 图片上传如何实现？

## 整体架构设计

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601194319.png)

## 页面和 API 设计

### 原型图

#### 注册

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195710.png)

#### 登录

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195806.png)

#### 设置

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195822.png)

#### 首页

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195841.png)

#### 个人主页

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195858.png)

#### 广场

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195918.png)

#### @我的

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195930.png)

#### 404

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601195948.png)

#### 错误页

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601200001.png)

#### 统一的 header和footer

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601200044.png)

### 页面和路由

- 注册  /register
- 登录  /login
- 首页  /
- 个人主页  /profile/:username
- at页  /atMe
- 广场  /square
- 设置  /setting
- 错误页  /error
- 404  /*

### 组件

- 发布博客输入框
- 博客列表
- 加载更多
- 个人信息
- 粉丝列表
- 关注人列表
- （其他：统一的 header 和 footer）

### API

#### 用户

- 登录
  - 登录  /api/user/login
- 注册
  - 注册  /api/user/register
  - 用户名是否存在  /api/user/isExist
- 设置
  - 修改个人信息  /api/user/changeInfo
  - 图片上传  /api/utils/upload
  - 修改密码  /api/user/changePassword
  - 退出登录  /api/user/logout

#### 微博

- 首页
  - 创建微博  /api/blog/create
  - 图片上传 /api/utils/upload
  - 加载更多  /api/blog/loadMore/:pageIndex
- 个人主页
  - 加载更多  /api/profile/loadMore/:username/:pageIndex
  - 关注  /api/profile/follow
  - 取消关注  /api/profile/unFollow
- 广场页
  - 加载更多  /a'pi/square/loadMore/:pageIndex
- at页
  - 创建微博  /api/blog/create
  - 图片上传  /api/utils/upload
  - 加载更多  /api/atMe/loadMore/:pageIndex

## 数据模型设计

#### ER图

#### 关系型数据库的三大范式

- 属性的原子性：每一列都不可在拆解
- 记录的唯一性：有唯一标识（主键），其他属性都依赖于主键
- 字段的冗余性：不存在数据冗余和传递依赖

作用：

- 数据规范严谨，不易出错
- 占用空间更小
- 访问速度更快

#### 数据模型设计

![image-20210601202926831](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20210601202926831.png)



# 开发

## 功能列表

- 用户管理（登录和注册）
- 用户设置（修改基本信息，修改密码，退出登录）
- 创建微博，暂不显示微博列表
- 个人主页，显示个人微博列表和个人信息，暂不做关注功能
- 广场页（使用缓存）
- 关注和取消关注，显示粉丝和关注人

## 用户管理

### git管理

- `git checkout -b feature-xxx`（新增 xxx 功能）
- `git checkout -b fix-xxx`（修复 xxx bug）
- 这里：`git checkout -b feature-login&register`

### 数据模型设计

现在只设计 User 表

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601221259.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601224610.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601224649.png)

### isExist

按照架构图设计

![](https://gitee.com/gainmore/imglib/raw/master/img/20210601194319.png)

其中，主要部分在 `controller` 和 `service` 中

- routes 中的路由只负责分发接口 + 获取请求的参数，其他的交给 controller 处理，最后将 controller 的返回值作为响应
- controller 处理的是业务逻辑，通过调用 service 中的函数获取数据，最后将数据按照一定格式返回到 routes 里，格式如 `SuccessModel` 和 `ErrorModel`
- service 里封装的一些处理数据库数据的方法，比如从数据库中查询某些数据，然后将这些数据格式化，比如如果某个字段为空则用默认数据代替

### register

### 密码加密

### 校验

1. 安装： `npm install ajv`

2. 在路由中插入中间件：

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210603213724.png)

3. 创建 `middleware` 文件夹，在 `validator.js` 中封装生成验证函数的中间件

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210603213949.png)

4. 创建 `validator` 文件夹，里面存放验证函数即可

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210603214035.png)

### 登录

采用 cookie-session 的方式实现登录

- 安装插件：`koa-generic-session` 和 `koa-redis`

- 在 `app.js` 中配置 session 并连接 redis

  ![](https://gitee.com/gainmore/imglib/raw/master/img/20210603233106.png)

- 在 controller 中进行登录

  ```javascript
  ...async function login(ctx, username, password) {  const userInfo = await getUserInfo(username, password)  if (!userInfo) { // 登录失败    return new ErrorModel(loginFailedInfo)  }  // 登录成功，随机生成sessionId，记录信息  const sessionId = genSessionId() // 生成sessionId  ctx.session[sessionId] = userInfo // 将用户数据存入redis  ctx.cookies.set('sessionId', sessionId) // 将sessionId加入到cookie中返回给客户端  return new SuccessModel(userInfo)}...
  ```

### 抽离登录校验中间件

1. 在 `middleware` 文件夹中新建 `loginCheck.js` 文件，写入：

   ```javascript
   const { ErrorModel } = require('../model/ResModel')const { notLoginInfo } = require('../model/ErrorInfo')async function loginCheck(ctx, next) {  const sessionId = ctx.cookies.get('sessionId') // 获取cookie中的sessionId  // 如果有sessionId并且在redis中有对应sessionId的值，说明已登录  if (sessionId && ctx.session && ctx.session[sessionId]) { // 已登录    await next()    return  }  ctx.body = new ErrorModel(notLoginInfo) // 未登录}module.exports = loginCheck
   ```

2. 测试中间件：

   ```javascript
   // 测试登录验证router.get('/test', loginCheck, async (ctx, next) => {  ctx.body = 'test success!'})
   ```

### 单元测试

1. 安装插件：

   - `npm install jest`
   - `npm install supertest`

2. 修改 `package.json`

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210604204128.png)

3. 根目录下新建 `test` 文件夹（测试文件以 `.test.js` 结尾）

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210604225919.png)

4. 按照顺序编写测试函数即可

## 用户设置

### 图片上传

1. 安装插件：

   - `npm install formidable-upload-koa`
   - `npm install fs-extra` 

2. 编写文件上传的路由，在 `routes/api` 下新建 `utils.js`，写入：

   ```javascript
   const router = require('koa-router')()const loginCheck = require('../../middleware/loginCheck')const koaForm = require('formidable-upload-koa')const { saveFile } = require('../../controller/utils')router.prefix('/api/utils')// 上传图片router.post('/upload', loginCheck, koaForm(), async (ctx, next) => {  const file = ctx.req.files['file']  console.log(file);  const { size, path, name, type } = file  // controller  ctx.body = await saveFile({    size,    name,    type,    filePath: path  })})module.exports = router
   ```

3. 在 `controller/` 下新建 `utils.js`，写入：

   ```javascript
   const { SuccessModel, ErrorModel } = require('../model/ResModel')const { fileSizeErrorInfo } = require('../model/ErrorInfo')const fsExtra = require('fs-extra')const path = require('path')// 文件最大为 1MB，单位 byteconst MAX_SIZE = 1024 * 1024// 存储文件的路径const DIST_PATH = path.resolve(__dirname, '../../uploadFiles')async function saveFile({ filePath, size, type, name }) {  // 判断文件大小  if (size > MAX_SIZE) {    // 文件过大，删除缓存中的文件，返回错误    await fsExtra.remove(filePath)    return new ErrorModel(fileSizeErrorInfo)  }  // 将缓存里的文件移动到指定文件夹下  const fileName = `${Date.now()}_${name}` // 防止重名  const distFilePath = path.resolve(DIST_PATH, fileName)  await fsExtra.move(filePath, distFilePath) // 将缓存文件移动到目标文件夹下  // 返回信息（图片url）  return new SuccessModel({    url: `http://localhost:3000/${fileName}`  })}module.exports = {  saveFile}
   ```

4. 为了能通过 url 访问图片，可以将 `uploadFiles` 这个文件夹作为静态资源共享出去，`app.js`：

   ```javascript
   ...app.use(require('koa-static')(__dirname + '/public')) // url访问public目录app.use(require('koa-static')(path.resolve(__dirname, '../uploadFiles')))...
   ```

5. 将 `uploadFiles` 在 `.gitignore` 中忽略，以免将不必要的文件上传到 git 中。

 **统一文件服务**

项目上线时，可能会分布到多个服务器上运行，如果采用上面创建 `uploadFiles` 的方式，可能会造成用户上传信息的混论。

这时，解决办法就是将这些文件统一上传到某个地方，然后返回对应的 url，比如图片可以上传到某些云图库中。这种上传到云服务的方法，就是**统一文件服务**。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210620083025.png)

### 单元测试

直接看项目代码。。。

## 创建微博

### 创建微博API

。。。

### 格式校验

。。。

### 预防XSS攻击

预防 XSS 攻击的主要手段是 XSS 过滤，这里用到的插件是 `xss`

1. `npm install xss`

2. controller 中：

   ![](https://gitee.com/gainmore/imglib/raw/master/img/20210620172534.png)

3. ![](https://gitee.com/gainmore/imglib/raw/master/img/20210620172609.png)

### 单元测试

。。。

## 个人主页

### 获取自己的博客

`api/blogs/home/:pageIndex`

### 获取他人的博客

`api/blogs/profile/:username/:pageIndex`

### 单元测试

。。。

## 广场页

### 功能需求

- 展示最新的博客，包含所有用户的博客。
- 设置缓存，当请求成功时，将数据缓存到 redis 中；缓存有生效时间，当超过生效时间后，缓存释放，需要再次访问数据库，以获取最新的数据。
- 缓存的设置可以避免用户频繁的请求而导致频繁访问数据库，提高了性能。

### 创建API

。。。

### 单元测试

。。。

## 关注和取消关注

### 设计模型

新建一个 `UserRelation` 表，用于存放关注者和被关注者的信息。

可以类比 `Blog` 表，一个用户可以有多个博客，所以 `User.hasMany(Blog)`，同理，一个用户可以关注多个用户，所以 `User.hasMany(UserRelation)`

`UserRelation` 表中设计两个字段 `userId` 和 `followerId`，`userId` 作为外键与 `User.id` 相对应，`followerId` 作为被关注者的 `id`。

![](https://gitee.com/gainmore/imglib/raw/master/img/20210624212501.png)

### 创建API

**主要是UserRelation和User这两个表对应外键的关系有点难以理解。**

### 单元测试

。。。

## 首页

首页展示的是用户的微博列表以及被关注用户的微博列表。

为了方便首页展示用户自己的微博列表，可以让用户自己关注自己，这样只要获取所有关注用户的微博列表就可以了（其中就包含用户自己的博客）。

当然，在原先获取粉丝和关注用户信息的API中也会获取到用户自身，所以可以使用查询语句 `[Sequelize.Op.ne]: xxx` 排除自身。

### 自己关注自己

在注册用户时，调用 `followService()` 关注自己

```javascript
async function createUser({ username, password, gender, nickname }) {  const rst = await User.create({    username,    password: encrypt(password),    nickname: nickname ? nickname : username,    gender  })  // 自己关注自己  await followService(rst.id, rst.id)  return rst.dataValues}
```

注意，需要修改 `获取粉丝的信息` 和 `获取关注用户信息` 这两个 API

```javascript
    include: [      {        model: UserRelation,        where: {          followerid: userId,          userid: { // 排除自己关注自己的情况(userid !== userId)            [Sequelize.Op.ne]: userId // Operation.not_equal          }        }      }    ]	...    where: {      userid: userId,      followerid: { // 排除自己关注自己的情况(followerid !== userId)        [Sequelize.Op.ne]: userId // Operation.not_equal      }    }
```

### 三表查询

因为首页信息既要展示用户自己的博客信息，又要展示关注用户的博客信息，所以会涉及 `User、Blog、UserRelation` 这三个表的联查。

关系图：

![](https://gitee.com/gainmore/imglib/raw/master/img/20210626150831.png)

代码：

```javascript
Blog.belongsTo(User, { // 用于Blog中查询User的信息  foreignKey: 'userid', // Blog.userid -> User.id})Blog.belongsTo(UserRelation, {  foreignKey: 'userid',  // Blog.userid -> UserRelation.followerid, 不设的话默认指向id  targetKey: 'followerid'})
```

三表查询：

```javascript
const rst = await Blog.findAndCountAll({    limit: pageSize, // 每页多少条    offset: pageIndex * pageSize, // 跳过多少条    order: [      ['id', 'desc'] // id倒序排序    ],    include: [ // 将三表整合在一起，并通过userId查询到结果      {        model: User,        attributes: ['username', 'nickname', 'avatar'],      },      {        model: UserRelation,        attributes: ['userid', 'followerid'],        where: {          userid: userId        }      }    ]  })
```

### 单元测试

。。。

## At功能

### 获取At列表

- 获取 At 列表，其实本质上是获取关注人的列表
- 获取到关注人的列表，然后主要是提供给前端，前端利用插件，实现在文本框中输入`@`就能提示出关注人列表

### 创建数据模型

- 要实现 At 功能，需要创建一个`AtRelation`数据表
- 需要两个字段，`userid`指向`User.id`，`blogid`指向`Blog.id`

### 添加At

- 设计一个 API `api/blogs/at`，参数为 `userid` 和 `blogid`
- 实现起来很简单，无非是在 AtRelation 中创建一条数据

### 显示At数量

。。。

### 标记为已读

。。。

### 单元测试

。。。

## 线上环境

### PM2

#### PM2介绍

- PM2 nodejs 进程管理工具（`npm install pm2 -g`）
- 守护进程：服务挂掉之后自动重启
- 多进程：更好的利用 CPU 和内存

#### PM2启动服务

`pm2 <fileNmae>`

![](https://gitee.com/gainmore/imglib/raw/master/img/20210628233457.png)

#### PM2常用命令

- `pm2 list` 查看进程列表信息

  ![](https://gitee.com/gainmore/imglib/raw/master/img/20210628233747.png)

- `pm2 restart <name | id> `

  - 比如重启上图中的进程可以使用 `pm2 restart www` 或者 `pm2 restart 0`

- `pm2 stop <name | id> `

  - 暂停进程

  - 之后，利用 `restart` 命令重启进程

- `pm2 delete <name | id> `

  - 直接删除进程

- `pm2 info <name | id> `

  - 查看进程的详细信息

- `pm2 log <name | id> `

  - 查看进程的日志信息

- `pm2 monit <name | id> `

  - 查看进程的控制台

#### PM2配置

1. 根目录下创建 `pm2.conf.json`

```json
{  "apps": {    "name": "weibo", 进程名称    "script": "bin/www", 启动文件    "watch": true, 项目代码一旦被修改，是否自动重启    "ignore_watch": [ 忽略修改自动重启的文件夹      "node_modules",      "logs",      "uploadFiles"    ],    "instances": 4, 进程个数，一般等于CPU核数    "error_file": "./logs/err.log", 错误日志的输出位置    "out_file": "./logs/out.log", 正常日志的输出位置    "log_date_format": "YYY-MM-DD HH:mm:ss" 日志时间格式化  }}
```

2. 修改 `package.json` 中生产环境的启动方式

   `pm2 start bin/www`  -->  `pm2 start pm2.conf.json`

#### 多进程

- 多进程可以更好的利用内存和 CPU
- 进程之间无法通讯，因此需要用 redis , mysql 统一的服务

![](https://gitee.com/gainmore/imglib/raw/master/img/20210629001136.png)

![](https://gitee.com/gainmore/imglib/raw/master/img/20210629001128.png)

### Nginx代理

#### 特点

- 静态文件服务器
- 负载均衡
- 反向代理
  - 一般网站都会将网址端口设置为默认端口80
  - 而在开发阶段项目的端口一般都不是80端口，比如3000端口
  - 所以通过反向代理，让用户访问80端口，再由 Nginx 转到项目对应的端口

#### 安装与配置

- 官网下载：http://nginx.org/en/download.html
- Mac 配置文件：/usr/local/etc/nginx/nginx.conf
- Windows 配置文件：D:\Program Files\Nginx\conf\nginx.conf

#### 命令

- nginx -t
- nginx
- nginx -s reload

#### 配置access_log

![image-20210629200946071](C:\Users\dell\AppData\Roaming\Typora\typora-user-images\image-20210629200946071.png)

### 日志

#### 类型

- access log（访问日志）
- 自定义日志（console.log）
- 错误日志（console.error）

#### access log

- 可以使用 nginx 配置 access log 的路径
- 不推荐使用 nodejs 记录 access log
  - 因为项目可能部署到多台服务器上，如果使用 nodejs 记录访问日志，就会使得信息分散，不方便管理

#### 自定义日志 & 错误日志

- 使用 PM2 日志（可自定义配置日志文件目录）
- 自定义日志 `console.log` 打印
- 错误日志使用 `console.error` 打印

#### 上线总结

![](https://gitee.com/gainmore/imglib/raw/master/img/20210629200732.png)



## 总结

### 回顾技术方案

![](https://gitee.com/gainmore/imglib/raw/master/img/20210629201153.png)

### Nodejs 最佳实践

![](https://gitee.com/gainmore/imglib/raw/master/img/Nodejs%E7%9A%84%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5.png)https://gitee.com/gitee-stars/)