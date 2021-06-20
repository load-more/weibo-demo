const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { SESSION_SECRET_KEY } = require('../src/conf/secretKeys')
const { COOKIE_CONF, REDIS_CONF } = require('../src/conf/db')
const path = require('path')

const index = require('./routes/index')
const users = require('./routes/users')
const usersAPIRouter = require('./routes/api/user')
const utilsAPIRouter = require('./routes/api/utils')
const blogAPIRouter = require('./routes/api/blog')

// session & redis
app.keys = [SESSION_SECRET_KEY]
app.use(session({
  // 配置cookie
  cookie: COOKIE_CONF.cookie,
  // 配置redis
  store: redisStore({
    all: REDIS_CONF.ip
  })
}))

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public')) // url访问public目录
app.use(require('koa-static')(path.resolve(__dirname, '../uploadFiles')))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(usersAPIRouter.routes(), usersAPIRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(blogAPIRouter.routes(), blogAPIRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
