const User = require('./user')
const Blog = require('./blog')

// 创建外键，不传入参数则会自动向Blog中添加userId作为外键
Blog.belongsTo(User, {
  foreignKey: 'userid',
})

User.hasMany(Blog, {
  foreignKey: 'userid',
})

module.exports = {
  User,
  Blog,
}
