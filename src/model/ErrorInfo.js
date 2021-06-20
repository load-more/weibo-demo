module.exports = {
  registerUsernameExistInfo: {
    errno: 10001,
    message: '用户名已存在'
  },
  registerUsernameNotExistInfo: {
    errno: 10002,
    message: '用户名未存在'
  },
  registerFailedInfo: {
    errno: 10003,
    message: '注册失败'
  },
  registerValidateErrorInfo: {
    errno: 10004,
    message: '用户信息格式化校验失败'
  },
  loginFailedInfo: {
    errno: 10005,
    message: '登录失败'
  },
  notLoginInfo: {
    errno: 10006,
    message: '未登录'
  },
  removeUserErrorInfo: {
    errno: 10007,
    message: '删除用户失败'
  },
  fileSizeErrorInfo: {
    errno: 10008,
    message: '文件尺寸过大'
  },
  changeInfoErrorInfo: {
    errno: 10009,
    message: '修改用户信息失败'
  },
  changePswErrorInfo: {
    errno: 10010,
    message: '修改密码失败'
  },
  createBlogErrorInfo: {
    errno: 10011,
    message: '创建博客失败'
  },
}