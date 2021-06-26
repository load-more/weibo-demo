const { User, Blog, UserRelation } = require('../db/model/index')

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
  const whereOpt = {}
  if (username) { // 当未传入username时，查询所有博客
    whereOpt.username = username
  }
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
        where: whereOpt
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

async function getHomeAllBlogService({ userId, pageIndex, pageSize }) {
  const rst = await Blog.findAndCountAll({
    limit: pageSize, // 每页多少条
    offset: pageIndex * pageSize, // 跳过多少条
    order: [
      ['id', 'desc'] // id倒序排序
    ],
    include: [ // 将三表整合在一起，并通过userId查询到结果
      {
        model: User,
        attributes: ['username', 'nickname', 'avatar'],
      },
      {
        model: UserRelation,
        attributes: ['userid', 'followerid'],
        where: {
          userid: userId
        }
      }
    ]
  })
  // 格式化数据
  const res = {}
  res.isEmpty = rst.rows.length === 0
  res.count = rst.rows.length
  res.pageIndex = pageIndex
  res.pageSize = pageSize
  res.blogList = rst.rows.map(item => {
    item.dataValues.user = item.dataValues.user.dataValues
    item.dataValues.userRelation = item.dataValues.userRelation.dataValues
    return item.dataValues
  })
  return res
}

module.exports = {
  createBlogService,
  getBlogListByUserService,
  getHomeAllBlogService,
}
