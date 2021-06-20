const User = require('../db/model/user')
const Blog = require('../db/model/blog')

async function createBlogService(username, content, image) {
  const userid = await User.findOne({
    where: {
      username
    },
    attributes: ['id'],
  })
  const rst = await Blog.create({
    userid: userid.dataValues.id,
    content,
    image,
  })
  return rst
}

module.exports = {
  createBlogService
}
