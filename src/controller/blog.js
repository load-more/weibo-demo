const {
  createBlogService,
  getBlogListByUserService,
} = require('../service/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  createBlogErrorInfo,
  getHomeBlogListErrorInfo,
  getProfileBlogListErrorInfo,
} = require('../model/ErrorInfo')
const xss = require('xss')
const router = require('../routes/api/blog')

// 创建博客
async function createBlog(ctx, content, image) {
  const sessionId = ctx.cookies.get('sessionId')
  const username = ctx.session[sessionId].username
  content = xss(content)
  const rst = await createBlogService(username, content, image)
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(createBlogErrorInfo)
}

// 获取自己的博客
async function getHomeBlogList(ctx, pageIndex) {
  const sessionId = ctx.cookies.get('sessionId')
  const username = ctx.session[sessionId].username
  const rst = await getBlogListByUserService({ username, pageIndex })
  if (rst) {
    console.log(rst);
    return new SuccessModel(rst)
  }
  return new ErrorModel(getHomeBlogListErrorInfo)
}

// 获取他人的博客
async function getProfileBlogList(username, pageIndex) {
  const rst = await getBlogListByUserService({ username, pageIndex })
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(getProfileBlogListErrorInfo)
}

module.exports = {
  createBlog,
  getHomeBlogList,
  getProfileBlogList,
}
