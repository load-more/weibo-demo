const Ajv = require('ajv')
const ajv = new Ajv({
  // allErrors: true // 输出所有的错误（速度较慢）
})


/**
 * @description 利用ajv格式化校验数据
 * @param {Object} schema 校验模型
 * @param {Object} [data={}] 数据
 * @return {*} 
 */
function validate(schema, data = {}) {
  const rst = ajv.validate(schema, data)
  if (!rst) {
    return ajv.errors[0]
  }
}

module.exports = validate