const seq = require('../seq')
const { INTEGER } = require('../types')

const UserRelation = seq.define('userRelation', {
  userid: {
    type: INTEGER,
    allowNull: false,
    comment: '外键，用户id，不为空'
  },
  followerid: {
    type: INTEGER,
    allowNull: false,
    comment: '关注者的id，不为空'
  }
})

module.exports = UserRelation
