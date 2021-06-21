const server = require('../server')

const COOKIE = 'koa.sid=VFlyql4iyKjcOertNLHqWsQntADmbraU; koa.sid.sig=Gj7Q1ZEg2FiisIja3edv-RbCeaw; sessionId=_1624284752756'

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
})

// 获取他人博客
test('获取他人的博客，应该成功', async () => {
  // 开始测试
  const res = await server
    .get('/api/blogs/profile/zhangsan/0')
    .set('cookie', COOKIE)
  expect(res.body.errno).toBe(0)
})
