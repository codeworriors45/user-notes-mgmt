module.exports = {
  PARAM_ENV: 'env',
  PARAM_ORG_NAME: 'orgname',
  PARAM_DOMAIN_NAME: 'domain_name',
  PARAM_IS_RESOURCE: 'is_resource',
  PARAM_TYPE: 'type',
  PARAM_USER_CODE: 'user_code',
  PARAM_CONTENT_TYPE: 'Content-Type',
  PARAM_ACCESS_TOKEN: 'token',
  PARAM_REQUEST_PATH: 'request_path',
  PARAM_QUERY_STRING: 'query_string',
  PARAM_APPLICATION_JSON: 'application/json',
  PARAM_REQUEST_POST: 'post',
  PARAM_REQUEST_PUT: 'put',
  PARAM_REQUEST_GET: 'get',
  PARAM_API_PRIFIX: '/api/user-notes',

  // projection
  PARAM_FIELDS: 'fields',

  // pagination
  PARAM_LIMIT: 'limit',
  PARAM_OFFSET: 'offset',
  PARAM_SKIP: 'skip',

  // sort
  PARAM_SORT: 'sort',
  PARAM_ASC: 'asc',
  PARAM_DESC: 'desc',

  // filter
  PARAM_FILTER: 'filter',
  PARAM_AND: 'and',
  PARAM_OR: 'or',
  PARAM_EQUAL: 'eq',
  PARAM_NOT_EQUAL: 'neq',
  PARAM_LESS_THAN: 'lt',
  PARAM_GREATER_THAN: 'gt',
  PARAM_LESS_EQUAL: 'lte',
  PARAM_GREATER_EQUAL: 'gte',
  PARAM_IN: 'in',
  PARAM_N_IN: 'nin',
  PARAM_NOT: 'not',
  PARAM_NONE: 'none',
  PARAM_ALL: 'all',
  PARAM_ANY: 'any',
  PARAM_SET: 'set',
  PARAM_UPSET: 'upset',
  PARAM_APPEND: 'append',
  PARAM_CONTAINS: 'contains',
  PARAM_ARRAY: 'array',
  PARAM_VALUES: 'values',
  PARAM_ELEM_MATCH: 'elemMatch',
  PARAM_REGEX: 'regex',

  URL_USER_SIGNUP: '/v1/signup/',
  URL_USER_LOGIN: '/v1/login',
  URL_ADD_EVENT: '/v1/add/note',
  URL_DELETE_NOTE: '/v1/delete/note/:note_id',
  URL_UPDATE_NOTE: '/v1/update/note/:note_id',
  URL_GET_OWN_NOTES: '/v1/get/notes/'
}
