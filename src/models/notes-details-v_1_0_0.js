'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('config')
require('mongoose-long')(mongoose)
const utils = require('../lib/utils')
const SchemaTypes = mongoose.Schema.Types

const noteDetailsSchema = new Schema({
  id: SchemaTypes.Long,
  updated_on: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  keywords: {
    type: [String]
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
    type: Boolean,
    default: false
  }
}, {
  collection: 'note_detail'
})

noteDetailsSchema.plugin(global.db.autoIncrement, {
  model: 'note_details',
  field: 'id',
  startAt: 1
})

module.exports = mongoose.model(utils.dbCons.COLLECTION_NOTE_DETAIL, noteDetailsSchema)
