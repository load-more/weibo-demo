/**
 * @description 单元测试的用户信息
 * @author load_more
 */

/**
 * 【特别提醒】cookie 是用户的敏感信息，此处只能是**测试**用户的 cookie
 * 每次测试用户重新登录，都需要更新这里的 cookie
 */

module.exports = {
  // 张三的信息
  Z_ID: 1,
  Z_USER_NAME: 'zhangsan',
  Z_COOKIE: 'koa.sid=JYXdFExSaMFGzVqoozmtxG_TTIZPH6Av; koa.sid.sig=0zpqIiPTVHhm5c-Crlz4awx2IWI; sessionId=_1624695066321',

  // 李四的信息
  L_ID: 2,
  L_USER_NAME: 'lisi',
  L_COOKIE: 'koa.sid=JYXdFExSaMFGzVqoozmtxG_TTIZPH6Av; koa.sid.sig=0zpqIiPTVHhm5c-Crlz4awx2IWI; sessionId=_1624695133953'
}
