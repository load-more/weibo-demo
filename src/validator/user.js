const validate = require('./_validate')

// 校验模型
const SCHEMA = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      pattern: '^[a-zA-Z][a-zA-Z0-9_]+$', // 字母开头，只能包含字母、数字、下划线
      maxLength: 255,
      minLength: 2
    },
    password: {
      type: 'string',
      maxLength: 255,
      minLength: 3
    },
    nickname: {
      type: 'string',
      maxLength: 255,
      minLength: 2
    },
    gender: {
      type: 'number',
      maximum: 3,
      minimum: 1
    },
    city: {
      type: 'string',
      maxLength: 255,
      minLength: 2
    },
    picture: {
      type: 'string',
      maxLength: 255
    }
  }
}


/**
 * @description 校验用户信息
 * @param {Object} [data={}] 校验数据
 * @return {*} 
 */
function validateUser(data = {}) {
  return validate(SCHEMA, data)
}

module.exports = validateUser