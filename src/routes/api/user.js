const router = require('koa-router')()
const { 
  isExist,
  register,
  login,
  remove,
  changeInfo,
  changePsw,
  logout
} = require('../../controller/user')
const { genValidator } = require('../../middleware/validator')
const validateUser = require('../../validator/user')
const loginCheck = require('../../middleware/loginCheck')
const { isTest } = require('../../utils/env')
const encrypt = require('../../utils/crypto')

router.prefix('/api/users')

// 注册（routes只负责派发路由和获取数据，其他交给controller）
router.post('/register', genValidator(validateUser), async (ctx, next) => {
  const { username, password, gender } = ctx.request.body
  ctx.body = await register({
    username,
    password,
    gender
  })
})

// 判断用户名是否存在
router.post('/isExist', async (ctx, next) => {
  const { username } = ctx.request.body
  ctx.body = await isExist(username)
})

// 登录
router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body
  ctx.body = await login(ctx, username, password)
})

// 修改用户信息
router.patch('/changeInfo', loginCheck, async (ctx, next) => {
  const { username, nickname, gender, avatar, city } = ctx.request.body
  const newInfo = { username, nickname, gender, avatar, city }
  ctx.body = await changeInfo(username, newInfo)
})

// 修改密码
router.patch('/changePsw', loginCheck, async (ctx, next) => {
  let { username, password } = ctx.request.body
  password = encrypt(password)
  ctx.body = await changePsw(username, password)
})

// 退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
  ctx.body = await logout(ctx)
})

// 删除用户（用于单元测试删除测试产生的数据）
router.post('/delete', async (ctx, next) => {
  if (isTest) { // 如果是测试环境，则删除用户
    const sessionId = ctx.cookies.get('sessionId') // 获取cookie中的sessionId
    const { username } = ctx.session[sessionId] // 从redis中找到sessionId对应的值
    ctx.body = await remove(username)
  }
})

// 测试登录验证
router.get('/test', loginCheck, async (ctx, next) => {
  ctx.body = 'test success!'
})

module.exports = router