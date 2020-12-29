'use strict'

const mongoose = require('mongoose')
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')
const Schema = mongoose.Schema

const roleDetailsSchema = new Schema({
  role_name: {
    type: String,
    required: true
  },
  role_identifier: {
    type: String,
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  updated_on: {
    type: Date,
    default: Date.now
  },
  created_on: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: String,
    default: config.database.defaults.createdBy
  },
  updated_by: {
    type: String,
    default: config.database.defaults.updatedBy
  },
  additional_attributes: [{
    name: String,
    value: String
  }]
}, {
  collection: 'role_details'
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_ROLE_DETAILS, roleDetailsSchema)
