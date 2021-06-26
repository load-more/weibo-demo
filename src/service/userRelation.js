const {
  UserRelation,
  User
} = require('../db/model/index')
const Sequelize = require('sequelize')

async function followService(userId, followerId) {
  const rst = await UserRelation.create({
    userid: userId,
    followerid: followerId
  })
  return rst.dataValues
}

async function unfollowService(userId, unfollowerId) {
  const rst = await UserRelation.destroy({
    where: {
      userid: userId,
      followerid: unfollowerId,
    }
  })
  return rst
}

async function getFansService(userId) {
  const rst = await User.findAndCountAll({
    attributes: ['id', 'username', 'nickname', 'avatar'],
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: UserRelation,
        where: {
          followerid: userId,
          userid: { // 排除自己关注自己的情况(userid !== userId)
            [Sequelize.Op.ne]: userId // Operation.not_equal
          }
        }
      }
    ]
  })
  const res = {}
  res.count = rst.count
  res.userList = rst.rows.map(item => item.dataValues)
  return res
}

async function getFollowersService(userId) {
  const rst = await UserRelation.findAndCountAll({
    attributes: ['userid', 'followerid'],
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'nickname', 'avatar'],
      }
    ],
    where: {
      userid: userId,
      followerid: { // 排除自己关注自己的情况(followerid !== userId)
        [Sequelize.Op.ne]: userId // Operation.not_equal
      }
    }
  })
  const res = {}
  res.count = rst.count
  res.userList = rst.rows.map(item => item.dataValues.user.dataValues)

  return res
}

module.exports = {
  followService,
  unfollowService,
  getFansService,
  getFollowersService
}
