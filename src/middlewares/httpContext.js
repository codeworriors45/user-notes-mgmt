'use strict'

const debug = require('debug')('httpContext')
const httpContext = require('express-http-context')

module.exports = function (opts = {}) {
  return function (req, res, next) {
    // Tenant name
    const tenantName = 'user_notes'
    debug('tenant=%s', tenantName)
    httpContext.set('tenant', tenantName)

    // User code
    req[opts.userCode] = req.headers.user_code
    debug('userCode=%s', req[opts.userCode])
    httpContext.set('userCode', req[opts.userCode])

    // Token
    req[opts.token] = req.headers.token
    debug('token=%s', req[opts.token])
    httpContext.set('token', req[opts.token])

    // Call next middleware in the chain
    next()
  }
}
