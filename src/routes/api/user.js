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
const {
  follow,
  unfollow,
  getFans,
  getFollowers
} = require('../../controller/userRelation')

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
  const { nickname, gender, avatar, city } = ctx.request.body
  const newInfo = { nickname, gender, avatar, city }
  ctx.body = await changeInfo(ctx, newInfo)
})

// 修改密码
router.patch('/changePsw', loginCheck, async (ctx, next) => {
  let { password, newPassword } = ctx.request.body
  password = encrypt(password)
  newPassword = encrypt(newPassword)
  ctx.body = await changePsw(ctx, password, newPassword)
})

// 退出登录
router.post('/logout', loginCheck, async (ctx, next) => {
  ctx.body = await logout(ctx)
})

// 关注用户
router.post('/follow', loginCheck, async (ctx, next) => {
  const { followerId } = ctx.request.body
  ctx.body = await follow(ctx, followerId)
})

// 取消关注
router.post('/unfollow', loginCheck, async (ctx, next) => {
  const { unfollowerId } = ctx.request.body
  ctx.body = await unfollow(ctx, unfollowerId)
})

// 获取用户粉丝
router.get('/:userId/fans', loginCheck, async (ctx, next) => {
  const { userId } = ctx.params
  ctx.body = await getFans(userId)
})

// 获取关注用户
router.get('/:userId/followers', loginCheck, async (ctx, next) => {
  const { userId } = ctx.params
  ctx.body = await getFollowers(userId)
})

// 删除用户（用于单元测试删除测试产生的数据）
router.post('/delete', async (ctx, next) => {
  const { username } = ctx.request.body
  if (isTest) { // 如果是测试环境，则删除用户
    ctx.body = await remove(username)
  }
})

// 测试登录验证
router.get('/test', loginCheck, async (ctx, next) => {
  ctx.body = 'test success!'
})

module.exports = router