// 测试 Blog model
const { Blog } = require('../../src/db/model/index')

test('Blog 模型的各个属性，符合预期', () => {
  // build 会构建一个内存的 Blog 实例，但不会提交到数据库中
  const blog = Blog.build({
      content: '测试内容',
      image: '测试图片url',
      userid: 1,
  })
  // 验证各个属性
  expect(blog.content).toBe('测试内容')
  expect(blog.image).toBe('测试图片url')
  expect(blog.userid).toBe(1)
})