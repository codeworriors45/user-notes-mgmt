'use strict'

const mongoose = require('mongoose')
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')
const Schema = mongoose.Schema

const roleDetailsSchema = new Schema({
  role_name: {
    type: Number,
    required: true
  },
  entity_details: {
    id: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  effective_date_to: {
    type: Date,
    default: '9999-12-12T00:00:00.000+0530',
    required: true
  },
  effective_date_from: {
    type: Date,
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
  collection: utils.dbCons.COLLECTION_USER_ROLE_DETAILS
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_USER_ROLE_DETAILS, roleDetailsSchema)
