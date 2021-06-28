const { AtRelation } = require('../db/model/index')

async function atUserService(userId, blogId) {
  const rst = await AtRelation.create({
    userid: userId,
    blogid: blogId
  })
  return true
}

async function getAtMeNumService(userId) {
  const rst = await AtRelation.findAndCountAll({
    where: {
      userid: userId,
      isread: false,
    }
  })
  const res = {
    count: rst.count
  }
  return res
}

module.exports = {
  atUserService,
  getAtMeNumService,
}
