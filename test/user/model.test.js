// 测试 User model
const User = require('../../src/db/model/user')

test('User 模型的各个属性，符合预期', () => {
  // build 会构建一个内存的 User 实例，但不会提交到数据库中
  const user = User.build({
      username: 'zhangsan',
      password: 'p123123',
      nickname: '张三',
      // gender: 1,
      avatar: '/xxx.png',
      city: '北京'
  })
  // 验证各个属性
  expect(user.username).toBe('zhangsan')
  expect(user.password).toBe('p123123')
  expect(user.nickname).toBe('张三')
  expect(user.gender).toBe(3) // 测试 gender 默认值
  expect(user.avatar).toBe('/xxx.png')
  expect(user.city).toBe('北京')
})