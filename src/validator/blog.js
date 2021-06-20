const validate = require('./_validate')

// 校验模型
const SCHEMA = {
  type: 'object',
  properties: {
    content: {
      type: 'string',
    },
    image: {
      type: 'string',
      maxLength: 255,
    }
  }
}

function validateBlog(data = {}) {
  return validate(SCHEMA, data)
}

module.exports = validateBlog