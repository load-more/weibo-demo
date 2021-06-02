const Sequelize = require('sequelize')

const config = {
  host: 'localhost',
  dialect: 'mysql'
}

// 线上环境使用连接池
// config.pool = {
//   max: 5, // 连接池中最大的连接数量
//   min: 0, // 连接池中最小的连接数量
//   idle: 10000 // 如果一个连接池 10s 之内没有使用则释放
// }

// 传入数据库名称，用户名，密码，配置
const seq = new Sequelize('weibo-demo', 'root', 'jiayou', config)

// 测试连接
seq.authenticate().then(() => {
  console.log('mysql连接成功！');
}).catch(() => {
  console.log('mysql连接失败！');
})

module.exports = seq