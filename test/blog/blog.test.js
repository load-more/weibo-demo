const server = require('../server')

// 测试用户的cookie，需要更新
const COOKIE = 'koa.sid=DP6yV5lZxnlfdYHMbqSMQEQiKgxzjoIQ; koa.sid.sig=Gie13wYL7WOOz-1b3HJ1hgx6WY8; sessionId=_1624364980914'

// 创建博客
test('创建博客，应该成功', async () => {
  // 测试博客信息
  const content = '测试博客_' + Date.now()
  const image = '/test.png'

  // 开始测试
  const res = await server
    .post('/api/blogs/create')
    .send({
      content,
      image
    })
    .set('cookie', COOKIE)
  expect(res.body.errno).toBe(0)
  expect(res.body.data.content).toBe(content)
  expect(res.body.data.image).toBe(image)
})

// 获取本人博客
test('获取自己的博客，应该成功', async () => {
  // 开始测试
  const res = await server
    .get('/api/blogs/home/0')
    .set('cookie', COOKIE)
  expect(res.body.errno).toBe(0)

  const data = res.body.data
  expect(data).toHaveProperty('isEmpty')
  expect(data).toHaveProperty('blogList')
  expect(data).toHaveProperty('pageSize')
  expect(data).toHaveProperty('pageIndex')
  expect(data).toHaveProperty('count')
})

// 获取他人博客
test('获取他人的博客，应该成功', async () => {
  // 开始测试
  const res = await server
    .get('/api/blogs/profile/zhangsan/0')
    .set('cookie', COOKIE)
  expect(res.body.errno).toBe(0)

  const data = res.body.data
  expect(data).toHaveProperty('isEmpty')
  expect(data).toHaveProperty('blogList')
  expect(data).toHaveProperty('pageSize')
  expect(data).toHaveProperty('pageIndex')
  expect(data).toHaveProperty('count')
})

// 获取广场页博客
test('获取广场页博客，应该成功', async () => {
  // 开始测试
  const res = await server
    .get('/api/blogs/square/0')
  expect(res.body.errno).toBe(0)

  const data = res.body.data
  expect(data).toHaveProperty('isEmpty')
  expect(data).toHaveProperty('blogList')
  expect(data).toHaveProperty('pageSize')
  expect(data).toHaveProperty('pageIndex')
  expect(data).toHaveProperty('count')
})
