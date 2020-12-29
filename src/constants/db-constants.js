module.exports = {

  // / //////////////////////
  // COMMONS
  // / /////////////////////
  COMMON_CREATED_BY: 'created_by',
  COMMON_UPDATED_BY: 'updated_by',
  COMMON_CREATED_ON: 'created_on',
  COMMON_UPDATED_ON: 'updated_on',
  PARAM_ATTACHMENTS: 'attachments',
  COMMON_IS_DELETED: 'is_deleted',
  COMMON_IS_ACTIVE: 'is_active',
  VALUE_DEFAULT_IS_DELETED: false,
  FIELD__ID: '_id',
  COLLECTION_SEQUENCE_DETAIL: 'sequence_detail',
  PARAM_DATA: 'data',
  COMMON_VERSION_1_0_0: '1.0.0',
  COMMON_VERSION_2_0_0: '2.0.0',
  COMMON_VERSION_1_1_0: '1.1.0',
  COMMON_VERSION_1_2_0: '1.2.0',
  COMMON_VERSION_1_3_0: '1.3.0',
  COMMON_VERSION_2_1_0: '2.1.0',
  FIELD_OBJECTTYPE: 'objectType',
  FIELD_ID: 'id',
  FIELD_LIGHTBLUE_DATE_FORMAT: 'yyyy-mm-dd\'T\'HH:MM:ss.lo',

  // / ///////////////////////
  FIELD_PROFILE: 'profile_data',
  FIELD_NAME: 'name',
  FIELD_EMAIL: 'email',
  FIELD_NICK_NAME: 'nickname',
  FIELD_GIVEN_NAME: 'given_name',
  FIELD_FAMILY_NAME: 'family_name',
  FIELD_GIVENNAME: 'givenName',
  FIELD_FAMILYNAME: 'familyName',
  FIELD_LANGUAGE: 'language',
  FIELD_GENDER: 'gender',
  FIELD_AGERANGE: 'ageRange',
  FIELD_DISPLAYNAME: 'displayName',
  FIELD_PICTURE: 'picture',
  FIELD_PICTURE_LARGE: 'picture_large',
  FIELD_AGE_RANGE: 'age_range',
  FIELD_MIN: 'min',
  FIELD_LOCALE: 'locale',
  DEFAULT_LOCALE_VALUE: 'en-US',
  FIELD_TIME_ZONE: 'timezone',
  FIELD_EMAIL_VERIFIED: 'email_verified',
  FIELD_CONTACT_NUMBER_VERIFIED: 'contact_number_verified',
  FIELD_USER_PASSWORD: 'userPassword',
  FIELD_CONTACT: 'contact',
  FIELD_IMAGE: 'image',
  FIELD_URL: 'url',
  FIELD_EMAILS: 'emails',
  FIELD_VALUE: 'value',
  FIELD_LARGESIZE: '400',
  FIELD_BASE64: 'base64',
  FIELD_PICTURES: 'pictures',
  FIELD_PICTURE_URL: 'url',

  // / ////////////////////////
  // // / ///////////////
  // / User Details collection
  // / //////////////
  COLLECTION_USER_DETAILS: 'user_details',
  FIELD_USER_EMAIL: 'email',
  FIELD_STATUS: 'status',
  VALUE_STATUS_ACTIVE: 1,
  FIELD_PASSWORD: 'pwd',

  // / ////////////////////////
  // // / ///////////////
  // / Role details collection
  // / //////////////
  COLLECTION_ROLE_DETAILS: 'role_details',
  ROLE_NAME: 'role_name',
  ROLE_IDENTIFIER: 'role_identifier',
  VALUE_ENTITY_TYPE_USER: 'USER',
  FIELD_TYPE: 'type',
  FIELD_ROLE_TYPE: 'role_type',
  FIELD_USER_CODE: 'user_code',

  // / ////////////////////////
  // // / ///////////////
  // / User role details collection
  // / //////////////
  COLLECTION_USER_ROLE_DETAILS: 'user_role_details',
  FIELD_ENTITY_DETAILS: 'entity_details',
  FIELD_ROLE_NAME: 'role_name',
  FIELD_USER_ROLE_DETAILS_ID: 'user_role_details_id',
  FIELD_EFFECTIVE_DATE_TO: 'effective_date_to',
  FIELD_EFFECTIVE_DATE_FROM: 'effective_date_from',

  // ///////////////
  // Authentication details
  // ///////////////
  COLLECTION_USER_AUTHENTICATION_DETAILS: 'user_authentication_details',
  FIELD_ACCESS_TOKEN: 'token',
  FIELD_EXPIRES_ON: 'expires_on',
  FIELD_DEVICE_TYPE: 'device_type',
  FIELD_ENTITY_NAME: 'entity_name',
  FIELD_TOKEN: 'token',
  FIELD_ROLE_IDENTIFIER: 'role_identifier',

  // //////////////////////////////
  // AUTHENTICATION API EXCLUSIONS
  // //////////////////////////////
  COLLECTION_AUTHENTICATION_API_EXC: 'authentication_api_exclusions',
  FIELD_URI: 'uri',
  FIELD_METHOD: 'method',
  FIELD_IS_DELETED: 'is_deleted',

  // ///////////////////////////
  // rbac_url_mapping
  // ///////////////////////////
  COLLECTION_RBAC_URL_MAPPING: 'rbac_url_mapping',
  FIELD_ACTION: 'action',

  // ///////////////////////////
  // RBAC RULE DETAILS
  // ///////////////////////////
  COLLECTION_RBAC_RULE_DETAILS: 'rbac_rule_details',
  FIELD_A: 'a',
  FIELD_CAN: 'can',

  // ///////////////
  // RBAC USER ENUMs
  // //////////////
  ENUM_APP_USER: 1,

  // ///////////////
  // VALUES OF RBAC
  // //////////////
  VALUE_APP_USER: 'APP_USER',

  // ///////////////
  // NOTE Details
  // //////////////
  COLLECTION_NOTE_DETAIL: 'note_detail',
  FIELD_TITLE: 'title',
  FIELD_DETAILS: 'details',
  FIELD_KEYWORDS: 'keywords'

}
