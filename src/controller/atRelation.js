const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { atUserErrorInfo, getAtMeNumErrorInfo } = require('../model/ErrorInfo')
const { atUserService, getAtMeNumService } = require('../service/atRelation')

async function atUser(userId, blogId) {
  try {
    await atUserService(userId, blogId)
    return new SuccessModel()
  } catch(ex) {
    console.error(ex)
    return new ErrorModel(atUserErrorInfo)
  }
}

async function getAtMeNum(ctx) {
  try {
    const sessionId = ctx.cookies.get('sessionId')
    const userId = ctx.session[sessionId].id
    const rst = await getAtMeNumService(userId)
    return new SuccessModel(rst)
  } catch(ex) {
    console.error(ex)
    return new ErrorModel(getAtMeNumErrorInfo)
  }
}

module.exports = {
  atUser,
  getAtMeNum
}
