const router = require('koa-router')()
const {
  createBlog,
  getHomeBlogList,
  getProfileBlogList,
  getSquareBlogList,
  getHomeAllBlog,
} = require('../../controller/blog')
const { atUser, readBlog } = require('../../controller/atRelation')
const loginCheck = require('../../middleware/loginCheck')
const { genValidator } = require('../../middleware/validator')
const validateBlog = require('../../validator/blog')


router.prefix('/api/blogs')

// 创建博客
router.post('/create', genValidator(validateBlog), loginCheck, async (ctx, next) => {
  const { content, image } = ctx.request.body
  ctx.body = await createBlog(ctx, content, image)
})

// 获取自己第几页的博客（注意是自己获取自己的博客，所以不用传入username，而是利用session）
router.get('/home/:pageIndex', async (ctx, next) => {
  const { pageIndex } = ctx.params
  ctx.body = await getHomeBlogList(ctx, pageIndex)
})

// 获取他人主页第几页的博客（需要传入usernmae）
router.get('/profile/:username/:pageIndex', async (ctx, next) => {
  const { username, pageIndex } = ctx.params
  ctx.body = await getProfileBlogList(username, pageIndex)
})

// 获取广场页的博客
router.get('/square/:pageIndex', async (ctx, next) => {
  const { pageIndex } = ctx.params
  ctx.body = await getSquareBlogList({ pageIndex })
})

// 获取首页的所有博客（自己的博客和关注者的博客）
router.get('/home/all/:pageIndex', loginCheck, async (ctx, next) => {
  const { pageIndex } = ctx.params
  ctx.body = await getHomeAllBlog({ ctx, pageIndex })
})

// 在博客中at某个关注用户
router.post('/at', loginCheck, async (ctx, next) => {
  const { userId, blogId } = ctx.request.body
  ctx.body = await atUser(userId, blogId)
})

// 将博客标记为已读
router.patch('/isRead', loginCheck, async (ctx, next) => {
  const { userId, blogId } = ctx.request.body
  ctx.body = await readBlog(userId, blogId)
})

module.exports = router
