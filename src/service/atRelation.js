const { AtRelation } = require('../db/model/index')

async function atUserService(userId, blogId) {
  const rst = await AtRelation.create({
    userid: userId,
    blogid: blogId
  })
  return true
}

module.exports = {
  atUserService,
}
