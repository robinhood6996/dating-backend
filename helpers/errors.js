const AlreayExist = (name) => {
  return {
    message: `${name} already exist`,
    status: 400
  }
}

module.exports = {AlreayExist}