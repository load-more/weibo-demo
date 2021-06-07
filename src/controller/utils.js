const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { fileSizeErrorInfo } = require('../model/ErrorInfo')
const fsExtra = require('fs-extra')
const path = require('path')

// 文件最大为 1MB，单位 byte
const MAX_SIZE = 1024 * 1024
// 存储文件的路径
const DIST_PATH = path.resolve(__dirname, '../../uploadFiles')

async function saveFile({ filePath, size, type, name }) {
  // 判断文件大小
  if (size > MAX_SIZE) {
    // 文件过大，删除缓存中的文件，返回错误
    await fsExtra.remove(filePath)
    return new ErrorModel(fileSizeErrorInfo)
  }

  // 将缓存里的文件移动到指定文件夹下
  const fileName = `${Date.now()}_${name}` // 防止重名
  const distFilePath = path.resolve(DIST_PATH, fileName)
  await fsExtra.move(filePath, distFilePath) // 将缓存文件移动到目标文件夹下

  // 返回信息（图片url）
  return new SuccessModel({
    url: `http://localhost:3000/${fileName}`
  })
}

module.exports = {
  saveFile
}