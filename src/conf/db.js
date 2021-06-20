const env = process.env.NODE_ENV // 环境参数

let MYSQL_CONF // MySQL参数
let REDIS_CONF // redis参数
let COOKIE_CONF // cookie设置

if (env === 'development') {
  MYSQL_CONF = {
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

  REDIS_CONF = {
    ip: '127.0.0.1:6379'
  }

  COOKIE_CONF = {
    cookie: {
      path: '/',
      httpOnly: 'true',
      maxAge: 24 * 60 * 60 * 1000 // 一天
    }
  }
} else if (env === 'production') {
  MYSQL_CONF = {
    table: 'weibo-demo',
    username: 'root',
    password: 'jiayou',
    config: {
      host: 'localhost',
      dialect: 'mysql'
    }
  }

  REDIS_CONF = {
    ip: '127.0.0.1:6379'
  }

  COOKIE_CONF = {
    cookie: {
      path: '/',
      httpOnly: 'true',
      maxAge: 24 * 60 * 60 * 1000 // 一天
    }
  }
} else if (env === 'test') {
  MYSQL_CONF = {
    table: 'weibo-demo',
    username: 'root',
    password: 'jiayou',
    config: {
      host: 'localhost',
      dialect: 'mysql'
    }
  }

  REDIS_CONF = {
    ip: '127.0.0.1:6379'
  }

  COOKIE_CONF = {
    cookie: {
      path: '/',
      httpOnly: 'true',
      maxAge: 24 * 60 * 60 * 1000 // 一天
    }
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
  COOKIE_CONF
}