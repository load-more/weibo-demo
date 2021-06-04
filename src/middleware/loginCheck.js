const { ErrorModel } = require('../model/ResModel')
const { notLoginInfo } = require('../model/ErrorInfo')

async function loginCheck(ctx, next) {
  const sessionId = ctx.cookies.get('sessionId') // 获取cookie中的sessionId
  // 如果有sessionId并且在redis中有对应sessionId的值，说明已登录
  if (sessionId && ctx.session && ctx.session[sessionId]) { // 已登录
    await next()
    return
  }
  ctx.body = new ErrorModel(notLoginInfo) // 未登录
}

module.exports = loginCheck