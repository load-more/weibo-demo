const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { atUserErrorInfo } = require('../model/ErrorInfo')
const { atUserService } = require('../service/atRelation')

async function atUser(userId, blogId) {
  try {
    await atUserService(userId, blogId)
    return new SuccessModel()
  } catch(ex) {
    console.error(ex)
    return new ErrorModel(atUserErrorInfo)
  }
}

module.exports = {
  atUser,
}
