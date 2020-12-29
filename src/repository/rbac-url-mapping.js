'use strict'

require('../models/rbac-url-mapping-v_1_0_0')
const utils = require('../lib/utils')

const findRbacName = async (query, projection, tenant) => {
  utils.logger.debug(`ENTER: findRbacName()`)
  try {
    const db = await global.db.connect(tenant)
    const rbacUrlMaping = db.model(utils.dbCons.COLLECTION_RBAC_URL_MAPPING)
    let mappingDetails = rbacUrlMaping.find(
      query,
      projection
    )
    utils.logger.debug(`EXIT: findRbacName()`)
    return mappingDetails
  } catch (error) {
    utils.logger.debug(`EXIT: findRbacName()`)
    utils.logger.error(`Error in fetching rbac url mapping: ${error}`)
    utils.logger.error(`Error in fetching rbac url mapping: ${JSON.stringify(error)}`)
    throw error
  }
}

const insertRbacUrlMapping = async (rbacUrlMapping, tenant) => {
  utils.logger.debug(`ENTER: insertRbacUrlMapping()`)
  try {
    const db = await global.db.connect(tenant)
    const rbacUrlMaping = db.model(utils.dbCons.COLLECTION_RBAC_URL_MAPPING)
    let mappingDetails = rbacUrlMaping.insertMany(
      rbacUrlMapping
    )
    utils.logger.debug(`EXIT: insertRbacUrlMapping()`)
    return mappingDetails
  } catch (error) {
    utils.logger.debug(`EXIT: insertRbacUrlMapping()`)
    utils.logger.error(`Error in inserting rbac url mapping: ${error}`)
    utils.logger.error(`Error in inserting rbac url mapping: ${JSON.stringify(error)}`)
    throw error
  }
}

module.exports = {
  findRbacName,
  insertRbacUrlMapping
}
