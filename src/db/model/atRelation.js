const seq = require('../seq')
const { INTEGER, BOOLEAN } = require('../types')

const AtRelation = seq.define('atRelation', {
  userid: {
    type: INTEGER,
    allowNull: false,
    comment: '用户id，不为空'
  },
  blogid: {
    type: INTEGER,
    allowNull: false,
    comment: '博客id，不为空'
  },
  isread: {
    type: BOOLEAN,
    defaultValue: false,
    comment: '是否已读，默认未读'
  }
})

module.exports = AtRelation
