const {
  UserRelation,
  User
} = require('../db/model/index')

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
          followerid: userId
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
      userid: userId
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
