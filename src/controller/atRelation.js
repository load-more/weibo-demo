const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  atUserErrorInfo,
  getAtMeNumErrorInfo,
  readBlogErrorInfo
} = require('../model/ErrorInfo')
const {
  atUserService,
  getAtMeNumService,
  readBlogService
} = require('../service/atRelation')

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

async function readBlog(userId, blogId) {
  const rst = await readBlogService(userId, blogId)
  if (rst) {
    return new SuccessModel()
  }
  return new ErrorModel(readBlogErrorInfo)
}

module.exports = {
  atUser,
  getAtMeNum,
  readBlog
}
