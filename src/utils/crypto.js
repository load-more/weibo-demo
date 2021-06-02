const crypto = require('crypto')
const { CRYPTO_SECRET_KEY } = require('../conf/secretKeys')

/**
 * @description 实现md5算法
 * @param {String} content 加密内容
 */
function _md5(content) {
  const md5 = crypto.createHash('md5')
  return md5.update(content).digest('hex')
}


/**
 * @description 加密函数
 * @param {String} content 加密模板
 */
function encrypt(content) {
  const template = `password=${content}&key=${CRYPTO_SECRET_KEY}`
  return _md5(template)
}

module.exports = encrypt