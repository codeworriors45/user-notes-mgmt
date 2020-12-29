'use strict'

require('../models/notes-details-v_1_0_0')
const { logger, dbCons } = require('../lib/utils')
const { getFinalQueryJson } = require('./db-operation')

const saveNotesDetails = async (data, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const NoteDetails = db.model(dbCons.COLLECTION_NOTE_DETAIL)
    const obj = new NoteDetails(data)
    const noteDetails = await obj.save()
    return noteDetails
  } catch (error) {
    logger.warn('Error in saving User Role Details: %s %j', error, error)
    throw error
  }
}

const findNotesDetails = async (query, projection, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const userAuthentication = db.model(dbCons.COLLECTION_NOTE_DETAIL)
    const authenticationDetails = userAuthentication.find(
      getFinalQueryJson(query),
      projection
    )
    return authenticationDetails
  } catch (error) {
    logger.warn('Error in saving User Role Details: %s %j', error, error)
    throw error
  }
}

const updateNoteDetails = async (query, data, tenant) => {
  try {
    const db = await global.db.connect(tenant)
    const userAuthentication = db.model(dbCons.COLLECTION_NOTE_DETAIL)
    const authenticationDetails = userAuthentication.findOneAndUpdate(
      getFinalQueryJson(query),
      data,
      { upsert: true, new: true }
    )
    return authenticationDetails
  } catch (error) {
    logger.warn('Error in saving User Role Details: %s %j', error, error)
    throw error
  }
}

module.exports = {
  saveNotesDetails,
  findNotesDetails,
  updateNoteDetails
}
