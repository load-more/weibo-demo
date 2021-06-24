const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  followErrorInfo,
  getFansErrorInfo,
  unfollowErrorInfo,
  getFollowersErrorInfo
} = require('../model/ErrorInfo')
const {
  followService,
  unfollowService,
  getFansService,
  getFollowersService
} = require('../service/userRelation')

async function follow(ctx, followerId) {
  const sessionId = ctx.cookies.get('sessionId')
  const userId = ctx.session[sessionId].id
  try {
    await followService(userId, followerId)
    return new SuccessModel()
  } catch(ex) {
    console.error(ex)
    return new ErrorModel(followErrorInfo)
  }
}

async function unfollow(ctx, unfollowerId) {
  const sessionId = ctx.cookies.get('sessionId')
  const userId = ctx.session[sessionId].id
  const rst = await unfollowService(userId, unfollowerId)
  if (rst) {
    return new SuccessModel()
  }
  return new ErrorModel(unfollowErrorInfo)
}

async function getFans(userId) {
  const rst = await getFansService(userId)
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(getFansErrorInfo)
}

async function getFollowers(userId) {
  const rst = await getFollowersService(userId)
  if (rst) {
    return new SuccessModel(rst)
  }
  return new ErrorModel(getFollowersErrorInfo)
}

module.exports = {
  follow,
  unfollow,
  getFans,
  getFollowers
}
