const env = process.env.NODE_ENV

module.exports = {
  isDev: env === 'development',
  notDev: env !== 'development',
  isPrd: env === 'production',
  notPrd: env !== 'production',
  isTest: env === 'test',
  notTest: env !== 'test',
}