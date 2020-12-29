'use strict'

require('../models/user-role-details-v_1_0_0')
const { logger, dbCons } = require('../lib/utils')
const { getFinalQueryJson } = require('./db-operation')

const fetchUserRoleDetailsData = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const roleDetailsModel = db.model(dbCons.COLLECTION_USER_ROLE_DETAILS)
    const userRoleDetails = await roleDetailsModel.find(
      getFinalQueryJson(query), projection
    ).lean()
    return userRoleDetails
  } catch (error) {
    logger.warn('Error in fetching User Role Details: %s %j', error, error)
    throw error
  }
}

const saveUserRoleDetails = async (data, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const UserRoleDetails = db.model(dbCons.COLLECTION_USER_ROLE_DETAILS)
    const obj = new UserRoleDetails(data)
    const userRoleDetails = await obj.save()
    return userRoleDetails
  } catch (error) {
    logger.warn('Error in saving User Role Details: %s %j', error, error)
    throw error
  }
}

module.exports = {
  fetchUserRoleDetailsData,
  saveUserRoleDetails
}
