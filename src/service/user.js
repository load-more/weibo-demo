/**
 * @description 封装数据库数据处理函数，并对数据格式化
 * @author load_more
 */

const { User } = require('../db/model/index')
const { formatUserInfo } = require('./_format')
const encrypt = require('../utils/crypto')

/**
 * @param {string} username 用户名
 * @param {string} password 密码
 * @return {*} 
 */
async function getUserInfo(username, password) {
  const whereOpt = { username } // 默认使用用户名查询
  if (password) { // 如果有密码，使用用户名加密码查询
    Object.assign(whereOpt, { password })
  }
  const res = await User.findOne({
    where: whereOpt
  })
  // 对结果进行格式化处理，比如设置默认picture
  if (res) {
    return formatUserInfo(res.dataValues)
  }
  return res
}

async function createUser({ username, password, gender, nickname }) {
  const rst = await User.create({
    username,
    password: encrypt(password),
    nickname: nickname ? nickname : username,
    gender
  })
  return rst.dataValues
}

async function deleteUser(username) {
  const rst = await User.destroy({
    where: {
      username
    }
  })
  // rst是删除的行数
  return rst > 0
}

async function changeInfoService(username, newInfo) {
  const rst = await User.update(newInfo, {
    where: {
      username: username
    }
  })
  return rst[0] > 0
}

async function changePswService(username, password, newPassword) {
  const rst = await User.update({
    password: newPassword,
  }, {
    where: {
      username,
      password
    }
  })
  return rst[0] > 0
}

module.exports = {
  getUserInfo,
  createUser,
  deleteUser,
  changeInfoService,
  changePswService
}