'use strict'

require('../models/role-details-v_1_0_0')
const { logger, dbCons, convertIntoArray } = require('../lib/utils')

const fetchRoleDetailsData = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const resourceModel = db.model(dbCons.COLLECTION_ROLE_DETAILS)
    const resourceDetail = await resourceModel.find(
      query, projection
    ).lean()
    return convertIntoArray(resourceDetail)
  } catch (error) {
    logger.warn('Error in fetching Role Details: %s %j', error, error)
    throw error
  }
}

module.exports = {
  fetchRoleDetailsData
}
