module.exports = {
  PARAM_ERROR_CODE: 'error_code',
  PARAM_ERROR_STATUS: 'error_status',
  PARAM_ERROR_MSG: 'error_msg',
  PARAM_ERROR_DESC: 'error_description',
  PARAM_ERROR: 'error',

  // /////////////////////
  // RESPONSE GENERATOR
  // /////////////////////
  RESPONSE_DATA: 'data',
  RESPONSE_STATUS_CODE: 'status_code',
  RESPONSE_STATUS_MSG: 'status_message',
  RESPONSE_ERRORS: 'errors',
  // //////////////////////////////////////////////////////
  // ERROR msg constants
  // //////////////////////////////////////////////////////
  MSG_EMAIL_ID_NOT_SPECIFIED: 'Email id is not specified',
  MSG_CONTACT_NOT_SPECIFIED: 'Contact is not specified',
  MSG_TIME_NOT_SPECIFIED: 'Timezone not available',
  MSG_ERROR_FORGOT_EMAIL: 'We cannot find an account with that email address.',
  MSG_ERROR_NO_DATA_FOUND: 'no data found',
  // //////////////////////////////////////////////////////
  MSG_ERROR_INVALID_REQUEST: 'Invalid request',
  MSG_INVALID_RESOURCE_ID: 'Invalid resource id',
  MSG_ERROR_SERVER_ERROR: 'Server error',
  MSG_ERROR_PLZ_TRY_AFTER: 'Please try after some time',
  MSG_ERROR_INVALID_CLIENT_CREDENTIAL: 'Invalid client credential',
  MSG_ERROR_EMAIL_NOT_SENT: 'error occured while sending email',
  MSG_NICK_NAME_NOT_SPECIFIED: 'Nick name not specified',
  MSG_ERROR_INVALID_PARAM_VALUE: 'Invalid parameter value:',
  MSG_ERROR_INSUFFICIENT_PARAM: 'Insufficeint parameter',
  MSG_ERROR_NO_SUCH_METHOD: 'No such method found',
  MSG_PROFILE_UPDATED_SUCCESSLLY: 'Profile updated successfully',
  MSG_USERS_DELETED: 'Users with same mail IDs deleted successfully',
  MSG_ERROR_PROFILE_UPDATE: 'Error while updating profile',
  MSG_ERROR_NO_SUCH_FIELD: 'No such field found to update profile',
  MSG_NO_USER_FOUND: 'No User Profile found',
  MSG_INVALID_USER_ID: 'Invalid User Id',
  MSG_RESPONSE_STORED: 'Response is sucessfully stored',
  REGISTRATION_SUCCESS: 'Registration successful',
  AUTHENTICATION_SUCCESS: 'User authenticated successfully',
  MSG_TOKEN_NOT_AVAILABLE: 'Token Not available',
  // / /////////////////////////////
  MSG_INVALID_USER: 'Access Denied, Invalid Server',
  MSG_BAD_REQUEST: 'Access Denied',
  CODE_CORS_ACCESS_DENIED: 'A15403',
  MSG_ERROR_INVALID_USER_CREDENTIAL: 'Invalid user credentials. Please enter correct username and password.',
  MSG_ERROR_SOCIAL_LOGIN: 'You are signed up using the social media account. You will not be able to reset the password.',
  MSG_NOT_REGISTERED: 'Email id or passwrod incorrect or You are not registered user',
  MSG_NO_USER_FOR_EMAIL: 'No user registered with this email ID',
  CODE_INVALID_USER_CREDENTIAL: 'A18105',
  MSG_YOUR_ACTIVATION_LINK_HAS_EXPIRED: 'Your activation link has expired',
  // / ////////////////////////////
  MSG_LOOKUP_DATA_FETCH_SUCCESSFULLY: 'Data fetched Successfully',
  MSG_EMAIL_ID_ALREADY_REGISTERED: 'Email already registered',
  MSG_USER_REGISTERTATION_SUCCESSFULL: 'User registered successfully.',
  MSG_ERROR_ACCOUNT_NOT_ACTIVETED: 'Account not activated',

  /// /////////////////////
  // Authentication
  /// ////////////////////
  MSG_TOKEN_INVALID: 'Access Denied, Invalid Token',
  MSG_TOKEN_VALIDATED: 'Token validated',
  MSG_NO_NEET_TOKEN_VALIDATION: 'No need to validate token',
  CODE_TOKEN_VERIFY: 'S18200',
  CODE_AUTH_ACCESS_DENIED: 'A18403',
  MSG_INTERNAL_SERVER_ERROR: 'Internal Server Error',
  MSG_INSUFFICIENT_DATA: 'Insufficient Data',
  MSG_INCOMPLETE_DATA: 'Incomplete Data',
  MSG_DATA_MISMATCH: 'Data Mismatch',
  RESPONSE_STATUS_DESC: 'status_descritpion',

  /// ///////////////////
  /// RBAC
  /// //////////////////
  MSG_UNAUTHORIZED_USER: 'Unauthorized user',
  MSG_NOT_ALLOWED_TO_DO_ACTION: 'You are not allowed to do this action',
  MSG_NO_ACTION_FOUND: 'No action found',
  MSG_SUCCESS_ROLE_VERIFIED: 'Role verified successfully',
  MSG_ROLE_VERIFIED: 'Role verified',
  MSG_RBAC_URL_MAPPING_NOT_FOUNT: 'Rbac and url mapping not found',
  MSG_NO_NEET_ROLE_VERIFICATION: 'No need to verify role',
  MSG_NOTE_ADDED_SUCCESSFULLY: 'Note added successfully.',
  MSG_NOTE_CANNOTE_BE_DELETED: 'You can only delete your owned notes or note may be already deleted',
  MSG_NOTE_CANNOTE_BE_UPDATED: 'You can only update your owned notes or note may be already updated',
  MSG_NOTE_DELETED_SUCCESSFULLY: 'Note deleted successfully.',
  MSG_NOTE_UPDATE_SUCCEFULLY: 'Note details updated successfully.',
  MSG_NOTES_FETCHED_SUCCESSFULLY: 'Your notes.',
  MSG_NO_NOTES_FOUND: 'No notes found.'
}
