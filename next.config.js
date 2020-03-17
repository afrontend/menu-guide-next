const { homepage } = require('./package.json')

module.exports = {
  assetPrefix: homepage || ''
}
