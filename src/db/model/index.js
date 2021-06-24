const User = require('./user')
const Blog = require('./blog')
const UserRelation = require('./userRelation')

// 创建外键，不传入参数则会自动向Blog中添加userId作为外键
Blog.belongsTo(User, { // 用于Blog中查询User的信息
  foreignKey: 'userid',
})
User.hasMany(Blog, { // 用于User中查询Blog的信息
  foreignKey: 'userid',
})

// 用于从UserRelation中查询User的信息
UserRelation.belongsTo(User, {
  foreignKey: 'followerid' // 用于获取关注用户的信息
})
// 用于从User中查询UserRelation的信息
User.hasMany(UserRelation, {
  foreignKey: 'userid'
})

module.exports = {
  User,
  Blog,
  UserRelation
}
