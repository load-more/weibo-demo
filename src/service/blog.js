const { User, Blog } = require('../db/model/index')

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

async function getBlogListByUserService(
  { username, pageIndex = 0, pageSize = 10 }
) {
  const rst = await Blog.findAndCountAll({
    limit: pageSize, // 每页多少条
    offset: pageSize * parseInt(pageIndex), // 跳过多少条
    order: [
      ['id', 'desc'] // 按id降序排列
    ],
    include: [
      {
        model: User,
        attributes: ['username', 'nickname', 'avatar'],
        where: {
          username
        }
      }
    ]
  })
  if (!rst) {
    return false
  }
  // 处理数据
  const res = {}
  res.isEmpty = (rst.rows.length === 0)
  res.count = rst.rows.length
  res.pageIndex = pageIndex
  res.pageSize = pageSize
  res.blogList = []
  rst.rows.forEach((item) => {
    res.blogList.push(item.dataValues)
  })
  return res
}

module.exports = {
  createBlogService,
  getBlogListByUserService,
}
