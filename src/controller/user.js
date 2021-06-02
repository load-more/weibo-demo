/**
 * @description 处理业务逻辑，返回格式化数据
 * @author load_more
 */

const { getUserInfo } = require('../service/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { registerUsernameExistInfo } = require('../model/ErrorInfo')

/**
 * @param {string} username 用户名
 */
async function isExist(username) {
  const userInfo = await getUserInfo(username)
  if (userInfo) { // 如果存在userInfo
    return new ErrorModel(registerUsernameExistInfo)
  }
  return new SuccessModel(userInfo)
}

module.exports = {
  isExist,
}