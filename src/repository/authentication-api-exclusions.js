'use strict'

require('../models/authentication-api-exclusions-v_1_0_0')
const { dbCons, logger } = require('../lib/utils')

const findExclusionsList = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const exclusionsList = db.model(dbCons.COLLECTION_AUTHENTICATION_API_EXC)
    const mappingDetails = exclusionsList.find(
      query,
      projection
    )
    return mappingDetails
  } catch (error) {
    logger.error('Error in fetching authentication exclusion list = %j %s', error, error)
    throw error
  }
}

const insertIntoExclusionList = async (data, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const ExclusionsList = db.model(dbCons.COLLECTION_AUTHENTICATION_API_EXC)
    const exclusionsList = new ExclusionsList(data)
    return exclusionsList.save()
  } catch (error) {
    logger.error('Error in saving authentication exclusion list = %j %s', error, error)
    throw error
  }
}

module.exports = {
  findExclusionsList,
  insertIntoExclusionList
}
