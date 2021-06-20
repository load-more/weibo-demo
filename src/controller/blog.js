const { createBlogService } = require('../service/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  createBlogErrorInfo
} = require('../model/ErrorInfo')

async function createBlog(ctx, content, image) {
  const sessionId = ctx.cookies.get('sessionId')
  const username = ctx.session[sessionId].username
  const rst = await createBlogService(username, content, image)
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(createBlogErrorInfo)
}

module.exports = {
  createBlog,
}
