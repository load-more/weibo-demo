const server = require('../server')
const { Z_COOKIE, L_ID, L_COOKIE } = require('../testUserInfo')

test('测试张三at李四，应该成功', async () => {
  const res = await server
    .post('/api/blogs/at')
    .send({
      userId: L_ID,
      blogId: 1
    })
    .set('cookie', Z_COOKIE)
  expect(res.body.errno).toBe(0)
})

test('测试显示atMe的数量，应该成功', async () => {
  const res = await server
    .get('/api/users/atMe')
    .set('cookie', L_COOKIE)
  expect(res.body.errno).toBe(0)
})

test('测试标记为已读，应该成功', async () => {
  const res = await server
    .patch('/api/blogs/isRead')
    .send({
      userId: L_ID,
      blogId: 1
    })
    .set('cookie', Z_COOKIE)
  expect(res.body.errno).toBe(0)
})

