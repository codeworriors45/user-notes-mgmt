'use strict'

const { config, dbCons, msgCons, logger, httpStatusCode, dbOperationCons, checkListContainsUrl, getStatusCode } = require('../lib/utils')
const { getQuery, getQueryArrayForOperation } = require('../repository/db-operation')
const httpContext = require('express-http-context')
const tokenMgmtConfig = config.get('token_mgmt_service')
const authExclusionListRepository = require('../repository/authentication-api-exclusions')
const { findAuthenticationDetails } = require('../repository/auth-token')
const crypto = require('crypto')
const authConfig = config.get('auth_token')
const SERVICE_CONS = 'TM_'
const dateFormat = require('dateformat')

let exclusionList
const tenant = httpContext.get('tenant')

storeExclusionListInMemory(tenant)

async function storeExclusionListInMemory (tenant) {
  exclusionList = await authExclusionListRepository.findExclusionsList(generateQueryForExclusionList(), generateProjectionForExclusionList(), tenant)
  logger.info(`exclusionList = ${JSON.stringify(exclusionList)}`)
}

/**
 * Return a middleware that verify token
 *
 * @return {function} Express middleware.
 */
module.exports = function (app) {
  return async function (req, res, next) {
    if (tokenMgmtConfig.enabled) {
      try {
        const userCode = req.headers[dbCons.FIELD_USER_CODE]
        const token = req.headers[dbCons.FIELD_TOKEN]
        const reqPath = req.path
        const reqMethod = req.method
        const tokenValidationResponse = await validateToken(reqPath, userCode, token, tenant, reqMethod)
        if (tokenValidationResponse.status_code !== `${SERVICE_CONS}200`) {
          return res.status(getStatusCode(tokenValidationResponse.status_code)).json(tokenValidationResponse)
        } else {
          next()
        }
      } catch (error) {
        return res.status(getStatusCode(error.error_code)).json(error)
      }
    }
  }
}

async function validateToken (reqPath, userCode, token, tenant, reqMethod) {
  const tokenRequireToValidate = await checkTokenUrl(reqPath, reqMethod)
  if (tokenRequireToValidate === false) {
    logger.debug(`userCode = ${userCode}, token = ${token}, reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_NO_NEET_TOKEN_VALIDATION}: api exclusions`)
    return tokenResponseGenerator(httpStatusCode.OK, msgCons.MSG_NO_NEET_TOKEN_VALIDATION, msgCons.MSG_NO_NEET_TOKEN_VALIDATION, false)
  }

  if (!userCode || !token) {
    logger.debug(`userCode = ${userCode}, token = ${token}, reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_INSUFFICIENT_DATA}`)
    return tokenResponseGenerator(httpStatusCode.UNAUTHORIZED, msgCons.MSG_INSUFFICIENT_DATA, msgCons.MSG_INSUFFICIENT_DATA, true)
  }

  let encryptedToken
  try {
    encryptedToken = JSON.parse(decodeAccessToken(token))
    if (parseInt(userCode) !== parseInt(encryptedToken[dbCons.FIELD_USER_CODE])) {
      throw tokenResponseGenerator(httpStatusCode.UNAUTHORIZED, msgCons.MSG_TOKEN_INVALID, msgCons.MSG_TOKEN_INVALID, true)
    }
    const authenticationDetails = await findAuthenticationDetails(generateQueryToAuthenticate(encryptedToken), generateProjectionForAuthDetails(), tenant)
    if (authenticationDetails.length > 0) {
      logger.debug(`userCode = ${userCode}, token = ${token}, reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_TOKEN_VALIDATED}`)
      return tokenResponseGenerator(httpStatusCode.OK, msgCons.MSG_TOKEN_VALIDATED, msgCons.MSG_TOKEN_VALIDATED, false)
    } else {
      throw tokenResponseGenerator(httpStatusCode.UNAUTHORIZED, msgCons.MSG_TOKEN_INVALID, msgCons.MSG_TOKEN_INVALID, true)
    }
  } catch (error) {
    if (typeof error === 'object') throw error
    logger.debug(`userCode = ${userCode}, token = ${token},  reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_TOKEN_INVALID}`)
    throw tokenResponseGenerator(httpStatusCode.UNAUTHORIZED, msgCons.MSG_TOKEN_INVALID, msgCons.MSG_TOKEN_INVALID, true)
  }
}

function generateQueryToAuthenticate (encryptedToken, isResource) {
  const queryJson = []
  queryJson.push(getQuery(dbCons.FIELD_ACCESS_TOKEN, dbOperationCons.OP_EQUAL, encryptedToken.token))
  queryJson.push(getQuery(dbCons.FIELD_USER_CODE, dbOperationCons.OP_EQUAL, encryptedToken[dbCons.FIELD_USER_CODE]))
  queryJson.push(getQuery(dbCons.FIELD_EXPIRES_ON, dbOperationCons.OP_GTE, dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss.lo")))
  queryJson.push(getQuery(dbCons.COMMON_IS_DELETED, dbOperationCons.OP_EQUAL, dbCons.VALUE_DEFAULT_IS_DELETED === 'true'))
  logger.debug(`queryJson = ${JSON.stringify(queryJson)}`)
  return getQueryArrayForOperation(dbOperationCons.OP_AND, queryJson)
}

function generateProjectionForAuthDetails () {
  const projection = {}
  projection[dbCons.FIELD_USER_CODE] = true
  return projection
}

function checkTokenUrl (reqPath, reqMethod) {
  const tokenizationExclusionList = exclusionList
  for (const tokenizationObject of tokenizationExclusionList) {
    if (tokenizationObject.method.toLowerCase() === reqMethod.toLowerCase()) {
      const validateUrl = checkListContainsUrl(tokenizationObject.uri, reqPath)
      if (validateUrl === false) {
        return false
      }
    }
  }
  return true
}

function tokenResponseGenerator (code, msg, desc, status) {
  const responseJson = {}
  if (status === undefined) {
    status = true
  }
  if (code === undefined) {
    code = msgCons.CODE_INTERNAL_ERROR
  }
  responseJson[msgCons.PARAM_ERROR_STATUS] = status
  if (status === true || status === 'true') {
    responseJson[msgCons.PARAM_ERROR_CODE] = SERVICE_CONS + code
    responseJson[msgCons.PARAM_ERROR_MSG] = msg
    responseJson[msgCons.PARAM_ERROR_DESC] = desc
  } else {
    responseJson[msgCons.RESPONSE_STATUS_CODE] = SERVICE_CONS + code
    responseJson[msgCons.RESPONSE_STATUS_MSG] = msg
    responseJson[msgCons.RESPONSE_STATUS_DESC] = desc
  }
  return responseJson
}

/**
 * [It would decode the generated token]
 * @param  {[type]}   encryptedAccessTokenJson [description]
 * @param  {Function} callback                 [description]
 * @return {[type]}                            [description]
 */
function decodeAccessToken (encryptedAccessTokenJson) {
  try {
    var decipher = crypto.createDecipher('des-ede3-cbc', authConfig.secret_key)
    var decryptedAccessToken = decipher.update(encryptedAccessTokenJson, authConfig.encoding, 'utf8')
    decryptedAccessToken += decipher.final('utf8')
    return decryptedAccessToken
  } catch (error) {
    return error
  }
}

function generateQueryForExclusionList () {
  return getQuery(dbCons.FIELD_IS_DELETED, dbOperationCons.OP_EQUAL, false)
}

function generateProjectionForExclusionList () {
  const projection = {}
  projection[dbCons.FIELD_URI] = true
  projection[dbCons.FIELD_METHOD] = true
  return projection
}
