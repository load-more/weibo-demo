const router = require('koa-router')()
const {
  createBlog,
  getHomeBlogList,
  getProfileBlogList,
} = require('../../controller/blog')
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

module.exports = router
