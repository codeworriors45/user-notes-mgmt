'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')

const rbacRuleDetailsSchema = new Schema({
  updated_on: {
    type: Date,
    default: Date.now
  },
  a: {
    type: String
  },
  can: {
    type: String
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  updated_by: {
    type: String,
    default: config.database.defaults.updatedBy
  },
  created_by: {
    type: String,
    default: config.database.defaults.createdBy
  },
  is_deleted: {
    type: Boolean
  }
}, {
  collection: 'rbac_rule_details'
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_RBAC_RULE_DETAILS, rbacRuleDetailsSchema)
