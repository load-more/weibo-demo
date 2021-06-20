const router = require('koa-router')()
const { createBlog } = require('../../controller/blog')
const loginCheck = require('../../middleware/loginCheck')
const { genValidator } = require('../../middleware/validator')
const validateBlog = require('../../validator/blog')


router. prefix('/api/blogs')

router.post('/create', genValidator(validateBlog), loginCheck, async (ctx, next) => {
  const { content, image } = ctx.request.body
  ctx.body = await createBlog(ctx, content, image)
})

module.exports = router
