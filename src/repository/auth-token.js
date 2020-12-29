'use strict'

require('../models/user-authentication-details-v_1_0_0')
const { logger, dbCons } = require('../lib/utils')

const saveAuthTokenDetails = async (data, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const TokenDetails = db.model(dbCons.COLLECTION_USER_AUTHENTICATION_DETAILS)
    const obj = new TokenDetails(data)
    const tokenDetails = await obj.save()
    return tokenDetails
  } catch (error) {
    logger.warn('Error in saving User Role Details: %s %j', error, error)
    throw error
  }
}

const findAuthenticationDetails = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const userAuthentication = db.model(dbCons.COLLECTION_USER_AUTHENTICATION_DETAILS)
    const authenticationDetails = userAuthentication.find(
      query,
      projection
    )
    return authenticationDetails
  } catch (error) {
    logger.warn('Error in saving User Role Details: %s %j', error, error)
    throw error
  }
}

module.exports = {
  saveAuthTokenDetails,
  findAuthenticationDetails
}
