'use strict'

const mongoose = require('mongoose')
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')
const Schema = mongoose.Schema
const SchemaTypes = mongoose.Schema.Types

const userDetails = new Schema({
  id: SchemaTypes.Long,
  email: {
    type: String,
    required: true
  },
  pwd: {
    type: String,
    required: true
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  is_deleted: {
    type: Boolean,
    required: true,
    default: false
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  updated_on: {
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
  created_on: {
    type: Date,
    default: Date.now
  },
  additional_attributes: [{
    name: {
      type: String
    },
    value: {
      type: String
    }
  }]
}, {
  collection: 'user_details'
})

userDetails.plugin(global.db.autoIncrement, {
  model: 'user_details',
  field: 'id',
  startAt: 1
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_USER_DETAILS, userDetails)
