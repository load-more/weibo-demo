const {
  createBlogService,
  getBlogListByUserService,
  getHomeAllBlogService,
} = require('../service/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  createBlogErrorInfo,
  getHomeBlogListErrorInfo,
  getProfileBlogListErrorInfo,
  getSquareBlogListErrorInfo,
  getHomeAllBlogErrorInfo
} = require('../model/ErrorInfo')
const { getSquareBlogListCache } = require('../cache/blog')
const xss = require('xss')
const router = require('../routes/api/blog')

// 创建博客
async function createBlog(ctx, content, image) {
  const sessionId = ctx.cookies.get('sessionId')
  const username = ctx.session[sessionId].username
  content = xss(content)
  try {
    const rst = await createBlogService(username, content, image)
    return new SuccessModel(rst)
  } catch(ex) {
    console.error(ex)
    return new ErrorModel(createBlogErrorInfo)
  }
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

// 获取广场页博客
async function getSquareBlogList({ pageIndex, pageSize = 10 }) {
  const rst = await getSquareBlogListCache(pageIndex, pageSize)
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(getSquareBlogListErrorInfo)
}

async function getHomeAllBlog({ ctx, pageIndex, pageSize = 10 }) {
  const sessionId = ctx.cookies.get('sessionId')
  const userId = ctx.session[sessionId].id
  const rst = await getHomeAllBlogService({
    userId,
    pageIndex,
    pageSize
  })
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(getHomeAllBlogErrorInfo)
}

module.exports = {
  createBlog,
  getHomeBlogList,
  getProfileBlogList,
  getSquareBlogList,
  getHomeAllBlog,
}
