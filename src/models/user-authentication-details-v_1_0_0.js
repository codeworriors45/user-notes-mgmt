'use strict'

const mongoose = require('mongoose')
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')
const Schema = mongoose.Schema

const authTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  expires_on: {
    type: String,
    required: true
  },
  user_code: {
    type: Number,
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
  role_identifier: {
    type: Number,
    required: true
  },
  device_type: {
    type: String
  },
  additional_attributes: [{
    name: String,
    value: String
  }]
}, {
  collection: 'user_authentication_details'
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_USER_AUTHENTICATION_DETAILS, authTokenSchema)
