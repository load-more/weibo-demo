/**
 * @description 格式化数据
 * @author load_more
 */

const { DEFAULT_PICTURE } = require('../conf/constant')

/**
 * @description 格式化用户信息中的picture
 * @param {Object} obj
 * @return {*} 
 */
function _formatUserPicture(obj) {
  if (!obj.picture) { // 如果不存在picture，用默认picture代替
    obj.picture = DEFAULT_PICTURE
  }
  return obj
}

/**
 *@description 格式化用户信息
 * @param {Array||Object} userInfo
 */
function formatUserInfo(userInfo) {
  if (Array.isArray(userInfo)) { // 如果userInfo是数组
    return userInfo.map(_formatUserPicture)
  }
  return _formatUserPicture(userInfo) // 如果是单个对象
}

module.exports = {
  formatUserInfo
}