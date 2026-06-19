export enum Message {
  SUCCESS = 'success',
  CREATED = 'created',
  NO_CONTENT = 'no content',
  BAD_REQUEST = 'bad request',
  ERROR_VALIDATION = 'validation error',
  NOT_FOUND = 'not found',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  INVALID_CREDENTIAL = 'email / password not valid',
  USER_CONFLICT = 'user already exists',
  DATA_EXIST = 'already exist',
  TOKEN_EXPIRED = 'token expired',
}
