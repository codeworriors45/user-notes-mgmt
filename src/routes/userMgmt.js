var express = require('express')
var router = express.Router()
const { urlCons } = require('../lib/utils')
const { signupUser, loginUser } = require('../controllers/user')
const { saveNotes, deleteNote, updateNoteAttribute, getOwnNoteDetails} = require('../controllers/notes')

/* user signup. */
router.post(urlCons.URL_USER_SIGNUP, signupUser)

/* user login. */
router.post(urlCons.URL_USER_LOGIN, loginUser)

/* add note by user. */
router.post(urlCons.URL_ADD_EVENT, saveNotes)

/* delete note by user. */
router.delete(urlCons.URL_DELETE_NOTE, deleteNote)

/* update note by user. */
router.put(urlCons.URL_UPDATE_NOTE, updateNoteAttribute)

/* get own note for user. */
router.get(urlCons.URL_GET_OWN_NOTES, getOwnNoteDetails)

module.exports = router
