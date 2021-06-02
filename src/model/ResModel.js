class BaseMoel {
  constructor({errno, data, message}) {
    this.errno = errno
    data && (this.data = data)
    message && (this.message = message)
  }
}

class SuccessModel extends BaseMoel {
  constructor(data) {
    super({
      errno: 0,
      data
    })
  }
}

class ErrorModel extends BaseMoel {
  constructor({ errno, message }) {
    super({
      errno,
      message
    })
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}