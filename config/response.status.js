class ResponseStatus {
  constructor(id, code, message, description) {
    this.id = id;
    this.code = code;
    this.message = message;
    this.description = description;
  }
}

const statusList = {
  OK: new ResponseStatus('OK', 200, 'SUCCESS', '요청이 성공적으로 되었습니다'),
  BAD_REQUEST: new ResponseStatus('BAD_REQUEST', 400, 'BAD_REQUEST', '잘못된 파라미터 입니다'),
  UNAUTHORIZED: new ResponseStatus('UNAUTHORIZED', 401, 'UNAUTHORIZED', '로그인이 필요합니다'),
  FORBIDDEN: new ResponseStatus('FORBIDDEN', 403, 'FORBIDDEN', '요청에 대한 권한이 없습니다'),
  SERVER_ERROR: new ResponseStatus('SERVER_ERROR', 500, 'SERVER_ERROR', '서버에서 문제가 발생했습니다'),
  CUSTOM_ERROR: new ResponseStatus('CUSTOM_ERROR', 500, '', ''),
};

module.exports = statusList;
