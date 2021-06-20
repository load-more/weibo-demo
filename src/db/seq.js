const Sequelize = require('sequelize')

// 线上环境使用连接池
// config.pool = {
//   max: 5, // 连接池中最大的连接数量
//   min: 0, // 连接池中最小的连接数量
//   idle: 10000 // 如果一个连接池 10s 之内没有使用则释放
// }

const MYSQL_CONF = {
  table: 'weibo-demo',
  username: 'root',
  password: 'jiayou',
  config: {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+08:00',
    // 将时间格式化
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  }
}

// 传入数据库名称，用户名，密码，配置
const seq = new Sequelize(
  MYSQL_CONF.table,
  MYSQL_CONF.username,
  MYSQL_CONF.password,
  MYSQL_CONF.config
)

// 测试连接
seq.authenticate().then(() => {
  console.log('mysql连接成功！');
}).catch(() => {
  console.log('mysql连接失败！');
})

module.exports = seq