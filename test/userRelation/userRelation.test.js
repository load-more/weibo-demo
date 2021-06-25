const server = require('../server')
const {
  Z_ID,
  Z_USER_NAME,
  Z_COOKIE,
  L_ID,
  L_USER_NAME,
  L_COOKIE
} = require('../testUserInfo')

// 关注
test('关注用户，应该成功', async () => {
  // 开始测试(张三关注李四)
  const res = await server
    .post('/api/users/follow')
    .send({
      followerId: L_ID
    })
    .set('cookie', Z_COOKIE) // 利用张三的cookie登录
  expect(res.body.errno).toBe(0)
})

// 获取关注用户信息
test('获取关注用户信息，应该成功', async () => {
  // 开始测试（张三获取关注用户信息）
  const res = await server
    .get(`/api/users/${Z_ID}/followers`)
    .set('cookie', Z_COOKIE)
  expect(res.body.errno).toBe(0)
  expect(res.body.data).toHaveProperty('count')
  expect(res.body.data).toHaveProperty('userList')
})

// 获取粉丝信息
test('获取粉丝信息，应该成功', async () => {
  // 开始测试
  const res = await server
    .get(`/api/users/${L_ID}/fans`)
    .set('cookie', L_COOKIE)
  expect(res.body.errno).toBe(0)
  expect(res.body.data).toHaveProperty('count')
  expect(res.body.data).toHaveProperty('userList')
})

// 取消关注
test('取消关注，应该成功', async () => {
  // 开始测试（张三取消关注李四）
  const res = await server
    .post('/api/users/unfollow')
    .send({
      unfollowerId: L_ID
    })
    .set('cookie', Z_COOKIE)
  expect(res.body.errno).toBe(0)
})
