'use strict'

const { responseGenerators, errorsArrayGenrator, msgCons, logger, getStatusCode } = require('../lib/utils')
const httpStatusCode = require('http-status-codes')
const httpContext = require('express-http-context')
const notesMgmtService = require('../services/notesMgmtService')

const saveNotes = async (req, res, next) => {
  const tenant = httpContext.get('tenant')
  const reqBody = req.body
  const userCode = req.headers.user_code
  try {
    const response = await notesMgmtService.saveNotes(reqBody, userCode, tenant)
    if (response[msgCons.RESPONSE_STATUS_CODE] !== undefined && getStatusCode(response[msgCons.RESPONSE_STATUS_CODE]) !== undefined) {
      res.status(getStatusCode(response[msgCons.RESPONSE_STATUS_CODE])).json(response)
    } else if (response.length === 0) {
      res.status(httpStatusCode.NO_CONTENT).json(responseGenerators(response, msgCons.CODE_NO_CONTENT_AVAILABLE, msgCons.MSG_ERROR_NO_DATA))
    } else {
      res.status(httpStatusCode.OK).json(responseGenerators(response, msgCons.CODE_SERVER_OK, msgCons.MSG_LOOKUP_DATA_FETCH_SUCCESSFULLY))
    }
  } catch (error) {
    if (error[msgCons.RESPONSE_STATUS_CODE] && getStatusCode(error[msgCons.RESPONSE_STATUS_CODE]) !== String(httpStatusCode.INTERNAL_SERVER_ERROR)) {
      res.status(getStatusCode(error[msgCons.RESPONSE_STATUS_CODE])).send(error)
    } else {
      logger.error('Error while authentication of user: %j', error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(errorsArrayGenrator(error, msgCons.CODE_INTERNAL_ERROR, msgCons.MSG_ERROR_SERVER_ERROR))
    }
  }
}

const deleteNote = async (req, res, next) => {
  const tenant = httpContext.get('tenant')
  const reqBody = req.body
  const userCode = req.headers.user_code
  const noteId = +req.params.note_id
  try {
    const response = await notesMgmtService.deleteNoteDetails(reqBody, userCode, noteId, tenant)
    if (response[msgCons.RESPONSE_STATUS_CODE] !== undefined && getStatusCode(response[msgCons.RESPONSE_STATUS_CODE]) !== undefined) {
      res.status(getStatusCode(response[msgCons.RESPONSE_STATUS_CODE])).json(response)
    } else if (response.length === 0) {
      res.status(httpStatusCode.NO_CONTENT).json(responseGenerators(response, msgCons.CODE_NO_CONTENT_AVAILABLE, msgCons.MSG_ERROR_NO_DATA))
    } else {
      res.status(httpStatusCode.OK).json(responseGenerators(response, msgCons.CODE_SERVER_OK, msgCons.MSG_LOOKUP_DATA_FETCH_SUCCESSFULLY))
    }
  } catch (error) {
    if (error[msgCons.RESPONSE_STATUS_CODE] && getStatusCode(error[msgCons.RESPONSE_STATUS_CODE]) !== String(httpStatusCode.INTERNAL_SERVER_ERROR)) {
      res.status(getStatusCode(error[msgCons.RESPONSE_STATUS_CODE])).send(error)
    } else {
      logger.error('Error while authentication of user: %j', error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(errorsArrayGenrator(error, msgCons.CODE_INTERNAL_ERROR, msgCons.MSG_ERROR_SERVER_ERROR))
    }
  }
}

const updateNoteAttribute = async (req, res, next) => {
  const tenant = httpContext.get('tenant')
  const reqBody = req.body
  const userCode = req.headers.user_code
  const noteId = +req.params.note_id
  try {
    const response = await notesMgmtService.updateNoteAttributes(reqBody, userCode, noteId, tenant)
    if (response[msgCons.RESPONSE_STATUS_CODE] !== undefined && getStatusCode(response[msgCons.RESPONSE_STATUS_CODE]) !== undefined) {
      res.status(getStatusCode(response[msgCons.RESPONSE_STATUS_CODE])).json(response)
    } else if (response.length === 0) {
      res.status(httpStatusCode.NO_CONTENT).json(responseGenerators(response, msgCons.CODE_NO_CONTENT_AVAILABLE, msgCons.MSG_ERROR_NO_DATA))
    } else {
      res.status(httpStatusCode.OK).json(responseGenerators(response, msgCons.CODE_SERVER_OK, msgCons.MSG_LOOKUP_DATA_FETCH_SUCCESSFULLY))
    }
  } catch (error) {
    if (error[msgCons.RESPONSE_STATUS_CODE] && getStatusCode(error[msgCons.RESPONSE_STATUS_CODE]) !== String(httpStatusCode.INTERNAL_SERVER_ERROR)) {
      res.status(getStatusCode(error[msgCons.RESPONSE_STATUS_CODE])).send(error)
    } else {
      logger.error('Error while authentication of user: %j', error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(errorsArrayGenrator(error, msgCons.CODE_INTERNAL_ERROR, msgCons.MSG_ERROR_SERVER_ERROR))
    }
  }
}

const getOwnNoteDetails = async (req, res, next) => {
  const tenant = httpContext.get('tenant')
  const reqBody = req.body
  const userCode = req.headers.user_code
  try {
    const response = await notesMgmtService.getOwnNotes(reqBody, userCode, tenant)
    if (response[msgCons.RESPONSE_STATUS_CODE] !== undefined && getStatusCode(response[msgCons.RESPONSE_STATUS_CODE]) !== undefined) {
      res.status(getStatusCode(response[msgCons.RESPONSE_STATUS_CODE])).json(response)
    } else if (response.length === 0) {
      res.status(httpStatusCode.NO_CONTENT).json(responseGenerators(response, msgCons.CODE_NO_CONTENT_AVAILABLE, msgCons.MSG_ERROR_NO_DATA))
    } else {
      res.status(httpStatusCode.OK).json(responseGenerators(response, msgCons.CODE_SERVER_OK, msgCons.MSG_LOOKUP_DATA_FETCH_SUCCESSFULLY))
    }
  } catch (error) {
    if (error[msgCons.RESPONSE_STATUS_CODE] && getStatusCode(error[msgCons.RESPONSE_STATUS_CODE]) !== String(httpStatusCode.INTERNAL_SERVER_ERROR)) {
      res.status(getStatusCode(error[msgCons.RESPONSE_STATUS_CODE])).send(error)
    } else {
      logger.error('Error while authentication of user: %j', error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(errorsArrayGenrator(error, msgCons.CODE_INTERNAL_ERROR, msgCons.MSG_ERROR_SERVER_ERROR))
    }
  }
}
module.exports = {
  saveNotes,
  deleteNote,
  updateNoteAttribute,
  getOwnNoteDetails
}
