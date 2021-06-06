/**
 * @description 处理业务逻辑，返回格式化数据
 * @author load_more
 */

const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  getUserInfo,
  createUser,
  deleteUser
} = require('../service/user')
const {
  registerUsernameExistInfo,
  registerUsernameNotExistInfo,
  registerFailedInfo,
  loginFailedInfo,
  removeUserErrorInfo
} = require('../model/ErrorInfo')
const genSessionId = require('../utils/genSessionId')
const encrypt = require('../utils/crypto')

/**
 * @description 判断用户名是否存在
 * @param {string} username 用户名
 */
async function isExist(username) {
  const userInfo = await getUserInfo(username)
  if (userInfo) { // 如果存在userInfo
    return new SuccessModel(userInfo)
  }
  return new ErrorModel(registerUsernameNotExistInfo)
}


/**
 * @description 注册
 * @param {*} { username, password, gender }
 * @return {*} 
 */
async function register({ username, password, gender }) {
  const userInfo = await getUserInfo(username)
  if (userInfo) { // 用户名已存在
    return new ErrorModel(registerUsernameExistInfo)
  }
  try {
    const rst = await createUser({ username, password, gender })
    return new SuccessModel(rst)
  } catch (ex) {
    console.error(ex)
    return new ErrorModel(registerFailedInfo)
  }
}

async function login(ctx, username, password) {
  const userInfo = await getUserInfo(username, encrypt(password))
  if (!userInfo) { // 登录失败
    return new ErrorModel(loginFailedInfo)
  }
  // 登录成功，随机生成sessionId，记录信息
  const sessionId = genSessionId() // 生成sessionId
  ctx.session[sessionId] = userInfo // 将用户数据存入redis
  ctx.cookies.set('sessionId', sessionId) // 将sessionId加入到cookie中返回给客户端
  return new SuccessModel(userInfo)
}

async function remove (username) {
  const rst = await deleteUser(username)
  if (rst) { // 删除成功
    return new SuccessModel()
  }
  return new ErrorModel(removeUserErrorInfo)
}

module.exports = {
  isExist,
  register,
  login,
  remove
}