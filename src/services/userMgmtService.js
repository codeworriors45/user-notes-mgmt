'use strict'

const { logger, dbOperationCons, dbCons, msgCons, msCons, httpStatusCode, config, convertIntoArray, responseGenerators, decodeUsingBase64 } = require('../lib/utils')
const { getQuery, getCommonProjection, getQueryArrayForOperation } = require('../repository/db-operation')
const SERVICE_CONS = 'UM_'
const { fetchUserDetails, saveUserDetails } = require('../repository/user-details')
const { fetchRoleDetailsData } = require('../repository/role-details')
const { saveUserRoleDetails, fetchUserRoleDetailsData } = require('../repository/user-role-details')
const { saveAuthTokenDetails } = require('../repository/auth-token')
const Joi = require('@hapi/joi')
const BCRYPT_SALT_ROUNDS = 10
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const dateFormat = require('dateformat')
var authConfig = config.get('auth_token')
const defaultRoleMapper = {
  USER: 'APP_USER'
}
const userTypeMapping = {
  USER: 1,
  ADMIN: 2
}

const signupUser = async (body, userType, tenant) => {
  try {
    const querySchema = Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      pwd: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      confirm_pwd: Joi.any().equal(Joi.ref('pwd')).required()
    })
    const validation = querySchema.validate(body)
    if (validation.error) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.BAD_REQUEST, msgCons.MSG_ERROR_INVALID_REQUEST, validation.error.details[0])
    }
    const { email, pwd } = body
    logger.debug('user going to register: %j', body.email)
    const hashedPass = await bcrypt.hash(pwd, BCRYPT_SALT_ROUNDS)
    const [userDetails, roleDetails] = await Promise.all([fetchUserDetails(generateQueryForUserDetails(email), getCommonProjection, tenant), fetchRoleDetailsData(generateQueryForRoleDetails(defaultRoleMapper[userType]), getProjectionForRoleDetails(), tenant)])
    if (userDetails) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.CONFLICT, msgCons.MSG_EMAIL_ID_ALREADY_REGISTERED, {})
    }
    delete body.confirm_pwd
    body.pwd = hashedPass
    const savedUser = await saveUserDetails(body)
    await saveUserRoleDetails(generateAddRoleBody(savedUser, roleDetails), tenant)
    return responseGenerators(savedUser._id, SERVICE_CONS + httpStatusCode.OK, msgCons.MSG_USER_REGISTERTATION_SUCCESSFULL, {})
  } catch (error) {
    logger.warn('Error while user registration %j %s', error, error)
    throw error
  }
}

const loginUser = async (body, userType, tenant) => {
  try {
    const querySchema = Joi.object({
      email: Joi.string().email().required(),
      pwd: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    })
    const validation = querySchema.validate(body)
    if (validation.error) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.BAD_REQUEST, msgCons.MSG_ERROR_INVALID_REQUEST, validation.error.details[0])
    }
    const { email, pwd } = body
    logger.debug('user going to login: %j', body.email)
    const hashedPass = await bcrypt.hash(pwd, BCRYPT_SALT_ROUNDS)
    const userDetails = await fetchUserDetails(generateQueryForUserDetailsLogin(email, hashedPass), getCommonProjection, tenant)
    if (!userDetails) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.CONFLICT, msgCons.MSG_NO_USER_FOR_EMAIL, {})
    } else {
      const isPasswrodMatch = await bcrypt.compare(pwd, userDetails.pwd)
      if (isPasswrodMatch === false) {
        return responseGenerators({}, SERVICE_CONS + httpStatusCode.BAD_REQUEST, msgCons.MSG_NOT_REGISTERED, {})
      }
    }
    if (userDetails.email_verified === false) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.BAD_REQUEST, msgCons.MSG_ERROR_ACCOUNT_NOT_ACTIVETED, {})
    }
    const userCode = userDetails.id.low_
    const token = await generateTokenForUser(userType, userCode, tenant)
    return responseGenerators(token, SERVICE_CONS + httpStatusCode.OK, msgCons.AUTHENTICATION_SUCCESS, {})
  } catch (error) {
    logger.warn('Error while user registration %j %s', error, error)
    throw error
  }
}

function generateTokenForUser (userType, userCode, tenant) {
  return new Promise(async (resolve, reject) => {
    const groupIdentifier = userTypeMapping[userType] || -1
    let actualUserRoleId = -1
    if (groupIdentifier !== -1) {
      let possibleRoles = await fetchRoleDetailsData(generateQueryForRoleDetailsRoleType(groupIdentifier), getProjectionForRoleDetails(), tenant)
      const data = convertIntoArray(possibleRoles)
      possibleRoles = data.map(function (item) { return item.role_identifier })
      actualUserRoleId = await fetchUserRoleDetailsData(generateQueryForUserRoleDetails(possibleRoles, userCode), { _id: 0 }, tenant)
    }
    const accessToken = await generateToken()
    var data = {}
    data[dbCons.FIELD_USER_CODE] = userCode
    data[dbCons.FIELD_TOKEN] = accessToken
    const cryptedToken = await encodeAccessToken(data)
    data[dbCons.FIELD_EXPIRES_ON] = getExpiryTime() // new Date();
    data[dbCons.FIELD_DEVICE_TYPE] = 'web'
    data[dbCons.COMMON_CREATED_BY] = 'admin'
    data[dbCons.COMMON_UPDATED_BY] = 'admin'
    data[dbCons.FIELD_ROLE_IDENTIFIER] = Number(actualUserRoleId[0].role_name)
    await saveAuthTokenDetails(data)
    resolve(cryptedToken)
  })
}

function getExpiryTime (expiryTime) {
  const copiedDate = new Date()
  if (expiryTime === 'undefined' || expiryTime === undefined) {
    copiedDate.setTime(copiedDate.getTime() + (authConfig.expiry_hour * 60 * 60 * 1000)) // (authConfig.expiry_hour * 60 * 60 * 1000)
  } else if (decodeUsingBase64(expiryTime) !== 'undefined' && decodeUsingBase64(expiryTime) !== msCons.FIELD_INFINITY) {
    copiedDate.setTime(copiedDate.getTime() + (decodeUsingBase64(expiryTime) * 60 * 60 * 1000)) // (authConfig.expiry_hour * 60 * 60 * 1000)
  } else {
    copiedDate.setYear(authConfig.expiry_year_infinite) // (authConfig.expiry_hour * 60 * 60 * 1000)
  }
  var newDate = dateFormat(copiedDate, "yyyy-mm-dd'T'HH:MM:ss.lo")
  return newDate
}

function generateQueryForRoleDetailsRoleType (groupIdentifier) {
  const query = {}
  query[dbCons.FIELD_ROLE_TYPE] = groupIdentifier
  return query
}

function generateQueryForUserRoleDetails (possibleRoles, userCode) {
  const query = []
  query.push(getQuery(dbCons.FIELD_ENTITY_DETAILS + '.' + dbCons.FIELD_ID, dbOperationCons.OP_EQUAL, userCode))
  query.push(getQuery(dbCons.ROLE_NAME, dbOperationCons.OP_IN, possibleRoles))
  return getQueryArrayForOperation(dbOperationCons.OP_AND, query)
}

function getProjectionForRoleDetails () {
  const projection = {}
  projection[dbCons.ROLE_IDENTIFIER] = true
  projection[dbCons.FIELD__ID] = false
  return projection
}

function generateQueryForUserDetails (email) {
  return getQuery(dbCons.FIELD_USER_EMAIL, dbOperationCons.OP_EQUAL, email)
}

function generateQueryForUserDetailsLogin (email, pwd) {
  const query = []
  query.push(getQuery(dbCons.FIELD_USER_EMAIL, dbOperationCons.OP_EQUAL, email))
  return getQueryArrayForOperation(dbOperationCons.OP_AND, query)
}

function generateQueryForRoleDetails (userType) {
  const query = {}
  query[dbCons.ROLE_NAME] = userType
  query[dbCons.COMMON_IS_DELETED] = false
  return query
}

function generateAddRoleBody (user, roleDetails) {
  const json = {}
  json[dbCons.FIELD_ROLE_NAME] = roleDetails[0].role_identifier
  const entityDetails = {}
  entityDetails[dbCons.FIELD_ID] = user.id.low_
  entityDetails[dbCons.FIELD_TYPE] = dbCons.VALUE_ENTITY_TYPE_USER
  json[dbCons.FIELD_ENTITY_DETAILS] = entityDetails
  json[dbCons.FIELD_EFFECTIVE_DATE_FROM] = dateFormat(new Date(), dbCons.FIELD_LIGHTBLUE_DATE_FORMAT)
  return json
}

async function generateToken () {
  try {
    const buffer = await crypto.randomBytes(256)
    const token = crypto.createHash('sha1').update(buffer).digest('hex')
    return token
  } catch (error) {
    logger.warn('Error while token generation %j %s', error, error)
  }
}

function encodeAccessToken (accessTokenJson) {
  try {
    var cipher = crypto.createCipher('des-ede3-cbc', authConfig.secret_key)
    var cryptedAccessToken = cipher.update(JSON.stringify(accessTokenJson), 'utf8', authConfig.encoding)
    cryptedAccessToken += cipher.final(authConfig.encoding)
    return cryptedAccessToken
  } catch (error) {
    logger.warn('Error while token generation %j %s', error, error)
  }
}

module.exports = {
  signupUser,
  loginUser
}
