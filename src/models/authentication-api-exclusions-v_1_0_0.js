'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')

const authenticationAPIExclusionsSchema = new Schema({
  updated_on: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String
  },
  uri: {
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
  collection: 'authentication_api_exclusions'
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_AUTHENTICATION_API_EXC, authenticationAPIExclusionsSchema)
