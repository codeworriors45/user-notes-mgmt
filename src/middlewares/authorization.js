'use strict'

const { config, dbCons, msgCons, logger, httpStatusCode, dbOperationCons, checkListContainsUrl, convertIntoArray, generateKeyValueJson, getValuesArrayFromJson, getStatusCode } = require('../lib/utils')
const { getQuery, getQueryArrayForOperation } = require('../repository/db-operation')
const httpContext = require('express-http-context')
const roleMgmtConfig = config.get('role_mgmt_service')
const rbacUrlMappingRepository = require('../repository/rbac-url-mapping.js')
const userRoleDetailsRepository = require('../repository/user-role-details.js')
const rbacRuleDetailsRepository = require('../repository/rbac-rule-details.js')
const authoExclusionListRepository = require('../repository/authorization-api-exclusions.js')
const { findAuthenticationDetails } = require('../repository/auth-token')
const { pathToRegexp } = require('path-to-regexp')
const crypto = require('crypto')
const authConfig = config.get('auth_token')
const SERVICE_CONS = 'TM_'
const dateFormat = require('dateformat')

let rbacMapping, exclusionList
const tenant = httpContext.get('tenant')

storeRbacMappingInMemory(tenant)
storeExclusionListInMemory(tenant)

async function storeRbacMappingInMemory (tenant) {
  const rbacMappingData = await rbacUrlMappingRepository.findRbacName(generateQueryForRbacUrlMapping(), generateProjectionForRbacUrlMapping(), tenant)
  const [rbacMappingJson, urlArray] = await Promise.all([
    generateKeyValueJson(rbacMappingData, dbCons.FIELD_URL, dbCons.FIELD_ACTION),
    getValuesArrayFromJson(dbCons.FIELD_URL, rbacMappingData)
  ])
  rbacMapping = {
    rbacMappingJson: rbacMappingJson,
    rbacUrlArray: urlArray
  }
  logger.info('rbacMappingJson = %j', rbacMapping.rbacMappingJson)
}

async function storeExclusionListInMemory (tenant) {
  exclusionList = await authoExclusionListRepository.findExclusionsList(generateQueryForExclusionList(), generateProjectionForExclusionList(), tenant)
  logger.info(`exclusionList = ${JSON.stringify(exclusionList)}`)
}

/**
 * Return a middleware that verify token
 *
 * @return {function} Express middleware.
 */
module.exports = function (app) {
  return async function (req, res, next) {
    if (roleMgmtConfig.enabled) {
      try {
        const userCode = req.headers[dbCons.FIELD_USER_CODE]
        const token = req.headers[dbCons.FIELD_TOKEN]
        const reqPath = req.path
        const reqMethod = req.method
        const tokenValidationResponse = await verifyRole(reqPath, userCode, token, tenant, reqMethod)
        if (tokenValidationResponse.response.status_code !== `${SERVICE_CONS}200`) {
          return res.status(getStatusCode(tokenValidationResponse.response.status_code)).json(tokenValidationResponse)
        } else {
          req.role_id = tokenValidationResponse.role_id
          next()
        }
      } catch (error) {
        return res.status(getStatusCode(error.error_code)).json(error)
      }
    }
  }
}

async function verifyRole (reqPath, userCode, token, tenant, reqMethod) {
  try {
    const rbacRequiredToVerify = await checkRbac(reqPath, reqMethod)
    if (rbacRequiredToVerify === false) {
      logger.debug(`userCode = ${userCode}, token = ${token}, reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_NO_NEET_ROLE_VERIFICATION}: api exclusions`)
      return roleResponseGenerator(httpStatusCode.OK, msgCons.MSG_NO_NEET_ROLE_VERIFICATION, msgCons.MSG_NO_NEET_ROLE_VERIFICATION, false)
    }

    const reqUrl = resolveRequestUrl(reqPath)
    const rbacName = rbacMapping.rbacMappingJson[reqUrl]
    if (rbacName === undefined) throw roleResponseGenerator(httpStatusCode.FORBIDDEN, msgCons.MSG_RBAC_URL_MAPPING_NOT_FOUNT, msgCons.MSG_RBAC_URL_MAPPING_NOT_FOUNT, true)
    let roleName, roleId
    let encryptedToken
    if (!token || !userCode) {
      roleName = dbCons.VALUE_ANONYMOUS_USER
      roleId = dbCons.ENUM_ANONYMOUS_USER
    } else {
      encryptedToken = JSON.parse(decodeAccessToken(token))
      const authenticationDetails = await findAuthenticationDetails(generateQueryToAuthenticate(encryptedToken), generateProjectionForAuthDetails(), tenant)
      const roleIdentifier = authenticationDetails[0] ? authenticationDetails[0][dbCons.FIELD_ROLE_IDENTIFIER] : null
      if (!roleIdentifier || roleIdentifier === -1) {
        [roleName, roleId] = await getRoleNameByUserCode(userCode, tenant)
      } else {
        roleId = authenticationDetails[0][dbCons.FIELD_ROLE_IDENTIFIER]
        roleName = getRoleNameFromEntityId(authenticationDetails[0][dbCons.FIELD_ROLE_IDENTIFIER])
      }
    }

    logger.debug(`rbacName = ${rbacName}, roleName = ${roleName}`)
    const rbacRuleDetails = await checkRbacRuleDetails(rbacName, roleName, tenant)
    if (rbacRuleDetails.length > 0) {
      logger.debug(`userCode = ${userCode}, token = ${token}, reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_ROLE_VERIFIED}`)
      return {
        role_name: roleName,
        role_id: roleId || dbCons.ENUM_ANONYMOUS_USER,
        response: roleResponseGenerator(httpStatusCode.OK, msgCons.MSG_SUCCESS_ROLE_VERIFIED, msgCons.MSG_ROLE_VERIFIED, false)
      }
    } else {
      logger.info(`rbacName = ${rbacName}, roleName = ${roleName}, userCode = ${userCode}, token = ${token}, reqPath = ${reqPath}, reqMethod = ${reqMethod}, msg = ${msgCons.MSG_NOT_ALLOWED_TO_DO_ACTION}`)
      throw roleResponseGenerator(httpStatusCode.FORBIDDEN, msgCons.MSG_NOT_ALLOWED_TO_DO_ACTION, msgCons.MSG_UNAUTHORIZED_USER, true)
    }
  } catch (e) {
    logger.debug('error while verify role name= %j %s', e, e)
    throw e
  }
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

function generateQueryToAuthenticate (encryptedToken) {
  const queryJson = []
  queryJson.push(getQuery(dbCons.FIELD_ACCESS_TOKEN, dbOperationCons.OP_EQUAL, encryptedToken.access_token))
  queryJson.push(getQuery(dbCons.FIELD_USER_CODE, dbOperationCons.OP_EQUAL, encryptedToken[dbCons.FIELD_USER_CODE]))
  queryJson.push(getQuery(dbCons.FIELD_EXPIRES_ON, dbOperationCons.OP_GTE, dateFormat(new Date(), "yyyy-mm-dd'T'HH:MM:ss.lo")))
  queryJson.push(getQuery(dbCons.COMMON_IS_DELETED, dbOperationCons.OP_EQUAL, dbCons.VALUE_DEFAULT_IS_DELETED === 'true'))
  logger.debug(`queryJson = ${JSON.stringify(queryJson)}`)
  return getQueryArrayForOperation(dbOperationCons.OP_AND, queryJson)
}

function generateProjectionForAuthDetails () {
  const projection = {}
  projection[dbCons.FIELD_USER_CODE] = true
  projection[dbCons.FIELD_ROLE_IDENTIFIER] = true
  return projection
}

function generateProjectionForRbacUrlMapping () {
  const projection = {}
  projection[dbCons.FIELD_URL] = true
  projection[dbCons.FIELD_ACTION] = true
  return projection
}

async function getRoleNameByUserCode (userCode, tenant) {
  try {
    const roleJson = await userRoleDetailsRepository.fetchUserRoleDetailsData(generateQueryForRole(userCode), generateProjectionForUserRole(), tenant)
    if (roleJson.length === 0) {
      throw roleResponseGenerator(httpStatusCode.FORBIDDEN, msgCons.MSG_NOT_ALLOWED_TO_DO_ACTION, msgCons.MSG_UNAUTHORIZED_USER, true)
    }
    return [getRoleNameFromEntityId(roleJson[0][dbCons.FIELD_ROLE_NAME]), roleJson[0][dbCons.FIELD_ROLE_NAME]]
  } catch (e) {
    logger.debug('error while getting role name by usercode= %j %s', e, e)
    throw (e)
  }
}

function generateQueryForRole (userCode) {
  const queryJson = []
  queryJson.push(getQuery(dbCons.FIELD_ENTITY_DETAILS + '.' + dbCons.FIELD_ID, dbOperationCons.OP_EQUAL, parseInt(userCode)))
  queryJson.push(getQuery(dbCons.FIELD_ENTITY_DETAILS + '.' + dbCons.FIELD_TYPE, dbOperationCons.OP_EQUAL, 'USER'))
  return getQueryArrayForOperation(dbOperationCons.OP_AND, queryJson)
}

function generateProjectionForUserRole () {
  const projection = {}
  projection[dbCons.FIELD_ROLE_NAME] = true
  return projection
}

async function checkRbacRuleDetails (rbacName, roleName, tenant) {
  try {
    const rbacJson = await rbacRuleDetailsRepository.fetchRbacDetails(generateQueryForRbac(rbacName, roleName), generateProjectionForRole(), tenant)
    return rbacJson
  } catch (e) {
    logger.debug('error while checking rbac rule details= %j %s', e, e)
    throw (e)
  }
}

function generateQueryForRbac (rbacName, roleName) {
  const queryJson = []
  queryJson.push(getQuery(dbCons.FIELD_A, dbOperationCons.OP_IN, convertIntoArray(roleName)))
  queryJson.push(getQuery(dbCons.FIELD_CAN, dbOperationCons.OP_EQUAL, rbacName))
  queryJson.push(getQuery(dbCons.FIELD_IS_DELETED, dbOperationCons.OP_EQUAL, false))
  return getQueryArrayForOperation(dbOperationCons.OP_AND, queryJson)
}

function generateProjectionForRole () {
  const projection = {}
  projection[dbCons.FIELD_A] = true
  return projection
}

function roleResponseGenerator (code, msg, desc, status) {
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

function resolveRequestUrl (reqUrl) {
  const urlList = rbacMapping.rbacUrlArray
  for (const url of urlList) {
    reqUrl = reqUrl.includes('?') === true ? reqUrl.split('?')[0] : reqUrl
    const re = pathToRegexp(url)
    if (re.exec(reqUrl)) {
      return url
    }
  }
  return ''
}

function checkRbac (reqPath, reqMethod) {
  const rbacExclusionList = exclusionList
  for (const exclusionObject of rbacExclusionList) {
    if (exclusionObject.method.toLowerCase() === reqMethod.toLowerCase()) {
      const validateUrl = checkListContainsUrl(exclusionObject.uri, reqPath)
      if (validateUrl === false) {
        return false
      }
    }
  }
  return true
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

function generateQueryForRbacUrlMapping () {
  return getQuery(dbCons.FIELD_IS_DELETED, dbOperationCons.OP_EQUAL, false)
}

function getRoleNameFromEntityId (enumRoleName) {
  logger.debug('getRoleNameFromEntityId()')
  switch (enumRoleName) {
    case dbCons.ENUM_APP_USER:
      return dbCons.VALUE_APP_USER
    default:
      return dbCons.VALUE_ANONYMOUS_USER
  }
}
