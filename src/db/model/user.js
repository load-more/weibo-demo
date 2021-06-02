const seq = require('../seq')
const { STRING, DECIMAL } = require('../types')

// 创建 User 模型，数据表的名字是 users
const User = seq.define('user', {
  // id 会自动创建，并设为主键、自增
  // 自动创建 createdAt、updatedAt
  username: {
    type: STRING, // varchar(255)
    allowNull: false,
    unique: true,
    comment: '用户名，不为空，唯一'
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '密码，不为空'
  },
  nickname: {
    type: STRING,
    allowNull: false,
    comment: '昵称，不为空'
  },
  gender: {
    type: DECIMAL,
    allowNull: false,
    defaultValue: 3,
    comment: '性别（1：男，2：女，3：保密），不为空，默认值为3'
  },
  avatar: {
    type: STRING,
    comment: '头像，存储图片地址'
  },
  city: {
    type: STRING,
    comment: '城市'
  }
})

module.exports = User