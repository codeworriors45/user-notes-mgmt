const { urlCons } = require('../lib/utils')
const userMgmt = require('./userMgmt')

module.exports = function (app) {
  app.use(urlCons.PARAM_API_PRIFIX, userMgmt)
}
