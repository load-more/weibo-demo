/**
 * @description 处理业务逻辑，返回格式化数据
 * @author load_more
 */

const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {
  getUserInfo,
  createUser
} = require('../service/user')
const {
  registerUsernameExistInfo,
  registerUsernameNotExistInfo,
  registerFailedInfo
} = require('../model/ErrorInfo')

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

module.exports = {
  isExist,
  register
}