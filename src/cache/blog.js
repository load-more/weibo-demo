const { set, get } = require('./_redis')
const { getBlogListByUserService } = require('../service/blog')

async function getSquareBlogListCache(pageIndex, pageSize) {
  const cacheName = `weibo_square_${pageIndex}${pageSize}`
  const cacheResult = await get(cacheName)
  if (cacheResult !== null) {
    return cacheResult
  }
  // 不传username，返回的就是所有用户的blog，按更新时间排序
  const rst = await getBlogListByUserService({ pageIndex, pageSize })
  // 设置缓存，过期时间60s
  set(cacheName, rst, 60)
  return rst
}

module.exports = {
  getSquareBlogListCache
}
