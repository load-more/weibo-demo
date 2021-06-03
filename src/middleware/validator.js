const { ErrorModel } = require('../model/ResModel')
const { registerValidateErrorInfo } = require('../model/ErrorInfo')


/**
 * @description 生成 json schema 格式验证的中间件
 * @param {Function} validateFn 校验函数
 * @return {*} 
 */
function genValidator(validateFn) {
  return async (ctx, next) => {
    const error = validateFn(ctx.request.body)
    if (error) { // 校验失败，返回错误信息
      ctx.body = new ErrorModel(registerValidateErrorInfo)
      return
    }
    await next() // 校验通过，下一个中间件
  }
}

module.exports = {
  genValidator
}