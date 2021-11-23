class ErrorStatus {
  constructor(id, message, description) {
    this.id = id;
    this.code = 500;
    this.message = message;
    this.description = description;
  }
}

const ERROR_STATUS = {
  ERROR_STATUS: ErrorStatus,
  DUPLICATE_KEY: new ErrorStatus('DUPLICATE_KEY', 'DUPLICATE_KEY', '중복된 데이터가 있습니다.'),
  NO_DATA: new ErrorStatus('NO_DATA', 'NO_DATA', '존재하지 않는 데이터입니다.'),
  INVALID_DATA: new ErrorStatus('INVALID_DATA', 'INVALID_DATA', '유효하지 않은 데이터입니다.'),
  LOST_DATA: new ErrorStatus('LOST_DATA', 'LOST_DATA', '처리하는 과정중에 데이터를 유실했습니다.'),
  MISMATCH_DATA: new ErrorStatus('MISMATCH_DATA', 'MISMATCH_DATA', '데이터가 일치하지 않습니다.'),
  PROCESSING_FAIL: new ErrorStatus('PROCESSING_FAIL', 'PROCESSING_FAIL', '서비스 로직을 처리하는 도중 알 수 없는 오류가 발생했습니다.'),
};
