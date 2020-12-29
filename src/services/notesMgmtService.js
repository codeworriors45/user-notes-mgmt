'use strict'

const { logger, dbOperationCons, msgCons, httpStatusCode, responseGenerators } = require('../lib/utils')
const { getQuery, getQueryArrayForOperation, getCommonProjection } = require('../repository/db-operation')
const SERVICE_CONS = 'NM_'
const { saveNotesDetails, findNotesDetails, updateNoteDetails } = require('../repository/note-details')
const Joi = require('@hapi/joi')

const saveNotes = async (body, userCode, tenant) => {
  try {
    const querySchema = Joi.object({
      title: Joi.string().required(),
      details: Joi.string().required(),
      keywords: Joi.array().required()
    })
    const validation = querySchema.validate(body)
    if (validation.error) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.BAD_REQUEST, msgCons.MSG_ERROR_INVALID_REQUEST, validation.error.details[0])
    }
    logger.debug('Note going to save: %j', body)

    const savedNote = await saveNotesDetails(generateNotesBody(body, userCode))
    return responseGenerators(savedNote._id, SERVICE_CONS + httpStatusCode.OK, msgCons.MSG_NOTE_ADDED_SUCCESSFULLY, {})
  } catch (error) {
    logger.warn('Error while saving notes %j %s', error, error)
    throw error
  }
}

const deleteNoteDetails = async (body, userCode, noteId, tenant) => {
  try {
    const noteOwnerShip = await findNotesDetails(generateQueryForNoteDetails(noteId, userCode), { _id: 1 }, tenant)
    if (noteOwnerShip.length === 0) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.NOT_ACCEPTABLE, msgCons.MSG_NOTE_CANNOTE_BE_DELETED, {})
    }
    logger.debug('Note going to Update: %j', noteOwnerShip[0]._id)
    const updateNote = await updateNoteDetails(generateQueryForNoteDetails(noteId, userCode), generateNotesDeleteBody(), tenant)
    if (updateNote) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.OK, msgCons.MSG_NOTE_DELETED_SUCCESSFULLY, {})
    }
  } catch (error) {
    logger.warn('Error while deleting notes %j %s', error, error)
    throw error
  }
}

const updateNoteAttributes = async (body, userCode, noteId, tenant) => {
  try {
    const querySchema = Joi.object({
      title: Joi.string(),
      details: Joi.string(),
      keywords: Joi.array()
    })
    const validation = querySchema.validate(body)
    if (validation.error) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.BAD_REQUEST, msgCons.MSG_ERROR_INVALID_REQUEST, validation.error.details[0])
    }
    const noteOwnerShip = await findNotesDetails(generateQueryForNoteDetails(noteId, userCode), { _id: 1 }, tenant)
    if (noteOwnerShip.length === 0) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.NOT_ACCEPTABLE, msgCons.MSG_NOTE_CANNOTE_BE_DELETED, {})
    }
    logger.debug('Note going to delete: %j', noteOwnerShip[0]._id)
    const updateNote = await updateNoteDetails(generateQueryForNoteDetails(noteId, userCode), generateBOdyToBeUpdated(body), tenant)
    if (updateNote) {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.OK, msgCons.MSG_NOTE_UPDATE_SUCCEFULLY, {})
    }
  } catch (error) {
    logger.warn('Error while updating notes %j %s', error, error)
    throw error
  }
}

const getOwnNotes = async (body, userCode, tenant) => {
  try {
    const updateNote = await findNotesDetails(generateQueryForOwnNoteDetails(userCode), getCommonProjection(), tenant)
    if (updateNote.length > 0) {
      return responseGenerators(updateNote, SERVICE_CONS + httpStatusCode.OK, msgCons.MSG_NOTES_FETCHED_SUCCESSFULLY, {})
    } else {
      return responseGenerators({}, SERVICE_CONS + httpStatusCode.OK, msgCons.MSG_NO_NOTES_FOUND, {})
    }
  } catch (error) {
    logger.warn('Error while fetching my notes %j %s', error, error)
    throw error
  }
}

function generateBOdyToBeUpdated (body) {
  const updateJson = {}
  const setJson = {}
  Object.keys(body).forEach(attribute => {
    updateJson[attribute] = body[attribute]
  })
  setJson.$set = updateJson
  return setJson
}

function generateQueryForNoteDetails (noteId, userCode) {
  const query = []
  query.push(getQuery('created_by', dbOperationCons.OP_EQUAL, userCode + ''))
  query.push(getQuery('id', dbOperationCons.OP_EQUAL, noteId))
  return getQueryArrayForOperation(dbOperationCons.OP_AND, query)
}

function generateQueryForOwnNoteDetails (userCode) {
  const query = []
  query.push(getQuery('created_by', dbOperationCons.OP_EQUAL, userCode + ''))
  return getQueryArrayForOperation(dbOperationCons.OP_AND, query)
}

function generateNotesDeleteBody () {
  const setJson = {}
  const updateJson = {}
  updateJson.is_deleted = true
  setJson.$set = updateJson
  return setJson
}

function generateNotesBody (body, userCode) {
  const bodyJson = {}
  bodyJson.created_by = userCode
  bodyJson.is_deleted = false
  return { ...bodyJson, ...body }
}

module.exports = {
  saveNotes,
  deleteNoteDetails,
  updateNoteAttributes,
  getOwnNotes
}
