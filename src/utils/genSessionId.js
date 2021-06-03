/**
 * @description 生成一个唯一的sessionId
 */
function genSessionId() {
  return `_${Date.now()}`
}

module.exports = genSessionId