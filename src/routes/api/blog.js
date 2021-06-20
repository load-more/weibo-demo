const router = require('koa-router')()
const { createBlog } = require('../../controller/blog')


router. prefix('/api/blogs')

router.post('/create', async (ctx, next) => {
  const { content, image } = ctx.request.body
  ctx.body = await createBlog(ctx, content, image)
})

module.exports = router
