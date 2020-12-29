'use strict'

require('../models/rbac-rule-details-v_1_0_0')
const utils = require('../lib/utils')

const fetchRbacDetails = async (query, projection, tenant) => {
  utils.logger.debug(`ENTER: fetchRbacDetails()`)
  try {
    const db = await global.db.connect(tenant)
    const rbacRule = db.model(utils.dbCons.COLLECTION_RBAC_RULE_DETAILS)
    let rbacRuleDetails = rbacRule.find(
      query,
      projection
    )
    utils.logger.debug(`EXIT: fetchRbacDetails()`)
    return rbacRuleDetails
  } catch (error) {
    utils.logger.debug(`EXIT: fetchRbacDetails()`)
    utils.logger.error(`Error in fetching rbac rule details: ${error}`)
    utils.logger.error(`Error in fetching rbac rule details: ${JSON.stringify(error)}`)
    throw error
  }
}

module.exports = {
  fetchRbacDetails
}
