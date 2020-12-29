'use strict'

require('../models/user-details-v_1_0_0')
const { logger, dbCons } = require('../lib/utils')
const { getFinalQueryJson } = require('./db-operation')

const fetchUserDetails = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const userDetailsModel = db.model(dbCons.COLLECTION_USER_DETAILS)
    const userDetails = await userDetailsModel.findOne(getFinalQueryJson(query), projection)
    return userDetails
  } catch (error) {
    logger.warn('Error in fetching user Details Repository: %s %j', error, error)
    throw error
  }
}

const saveUserDetails = async (data, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const UserDetailsModel = db.model(dbCons.COLLECTION_USER_DETAILS)
    const userDetails = new UserDetailsModel(data)
    return userDetails.save()
  } catch (error) {
    logger.warn('Error in fetching user Details Repository: %s %j', error, error)
    throw error
  }
}

module.exports = {
  fetchUserDetails,
  saveUserDetails
}
