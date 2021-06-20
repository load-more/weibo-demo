const server = require('../server')

const COOKIE = 'koa.sid=ldwd28OVJuTIqFIS-KOCDqiJqqLWNJvY; koa.sid.sig=A0KKv-1eVDErKddMblfLDzmTwkU; sessionId=_1624183549381'

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
