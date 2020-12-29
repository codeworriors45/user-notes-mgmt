'use strict'

require('../models/authorization-api-exclusions-v_1_0_0')
const utils = require('../lib/utils')

const findExclusionsList = async (query, projection, tenant) => {
  utils.logger.debug(`ENTER: findExclusionsList()`)
  try {
    const db = await global.db.connect(tenant)
    const exclusionsList = db.model(utils.dbCons.COLLECTION_AUTHORIZATION_API_EXC)
    let mappingDetails = exclusionsList.find(
      query,
      projection
    )
    utils.logger.debug(`EXIT: findExclusionsList()`)
    return mappingDetails
  } catch (error) {
    utils.logger.debug(`EXIT: findExclusionsList()`)
    utils.logger.error(`Error in fetching authorization exclusion list: ${error}`)
    utils.logger.error(`Error in fetching authorization exclusion list: ${JSON.stringify(error)}`)
    throw error
  }
}

module.exports = {
  findExclusionsList
}
