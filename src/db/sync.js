const seq = require('./seq')

require('./model')

// 初始化数据
seq.sync({
  force: true // 当存在表时，强制覆盖
}).then(() => {
  console.log('数据库同步完成！');
  process.exit()
})