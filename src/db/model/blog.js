const seq = require('../seq')
const { STRING, DECIMAL, TEXT, INTEGER } = require('../types')

// 创建 Blog 模型，数据表的名字是 blogs
const Blog = seq.define('blog', {
  // id 会自动创建，并设为主键、自增
  // 自动创建 createdAt、updatedAt
  content: {
    type: TEXT, // varchar(255)
    allowNull: false,
    comment: '内容，不为空'
  },
  image: {
    type: STRING,
    comment: '图片'
  },
  userid: {
    type: INTEGER,
    allowNull: false,
    comment: '外键，不为空'
  },
})

module.exports = Blog