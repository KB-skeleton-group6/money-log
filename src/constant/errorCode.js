export const ErrorCode = {
  // 1. 공통 및 입력값 관련 (2000번대)
  REQUIRED_FIELD_MISSING: {
    code: 2001,
    msg: '❗️필수 입력 항목이 누락되었습니다. 모든 필드를 채워주세요.❗️',
  },
  INVALID_DATE_FORMAT: {
    code: 2002,
    msg: '❗️유효하지 않은 날짜 형식입니다. 날짜를 다시 선택해주세요.❗️',
  },
  FUTURE_DATE_NOT_ALLOWED: {
    code: 2003,
    msg: '❗️미래 날짜는 기록할 수 없습니다. 오늘 이전의 날짜를 입력해주세요.❗️',
  },
  INVALID_DATE_RANGE: {
    code: 2004,
    msg: '❗️종료일이 시작일보다 빠를 수 없습니다. 기간을 다시 설정해주세요.❗️',
  },
  DATE_RANGE_EXCEEDED: {
    code: 2005,
    msg: '❗️최대 조회 가능 기간(예: 1년)을 초과했습니다. 범위를 줄여주세요.❗️',
  },

  // 2. 금액 관련 (3000번대)
  INVALID_AMOUNT_FORMAT: {
    code: 3001,
    msg: '❗️금액은 숫자만 입력 가능합니다.❗️',
  },
  AMOUNT_OUT_OF_RANGE: {
    code: 3002,
    msg: '❗️금액 범위를 확인해주세요. (최대 10억 원까지 입력 가능)❗️',
  },
  ZERO_AMOUNT_NOT_ALLOWED: {
    code: 3003,
    msg: '❗️0원인 내역은 저장할 수 없습니다.❗️',
  },

  // 3. 카테고리 및 내역 관련 (4000번대)
  INVALID_CATEGORY_ID: {
    code: 4001,
    msg: '❗️선택하신 카테고리가 유효하지 않습니다.❗️',
  },
  NON_EXISTENT_TRANSACTION: {
    code: 4002,
    msg: '❗️해당 거래 내역을 찾을 수 없습니다.❗️',
  },
  MEMO_TOO_LONG: {
    code: 4003,
    msg: '❗️메모는 최대 100자까지만 작성 가능합니다.❗️',
  },

  // 4. 데이터 통신 및 시스템 관련 (5000번대)
  FETCH_FAILED: {
    code: 5001,
    msg: '❗️데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.❗️',
  },
  SAVE_FAILED: {
    code: 5002,
    msg: '❗️저장에 실패했습니다. 네트워크 연결을 확인해주세요.❗️',
  },
  NETWORK_OFFLINE: {
    code: 5003,
    msg: '❗️네트워크 연결이 끊겼습니다. 인터넷 연결 상태를 확인해주세요.❗️',
  },
  SERVER_TIMEOUT: {
    code: 5004,
    msg: '❗️서버 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.❗️',
  },

  // 6. 로그인 및 회원가입 관련 (6000번대)
  EMPTY_ID_FIELD: {
    code: 6001,
    msg: '❗️아이디를 입력해주세요.❗️',
  },
  EMPTY_PASSWORD_FIELD: {
    code: 6002,
    msg: '❗️비밀번호를 입력해주세요.❗️',
  },
  EMPTY_NICKNAME_FIELD: {
    code: 6003,
    msg: '❗️닉네임을 입력해주세요.❗️',
  },
  PASSWORD_MISMATCH: {
    code: 6004,
    msg: '❗️비밀번호가 일치하지 않습니다. 다시 확인해주세요.❗️',
  },
  INVALID_ID_FORMAT: {
    code: 6005,
    msg: '❗️아이디 형식이 올바르지 않습니다. (영문/숫자 조합 4~12자)❗️',
  },
  DUPLICATE_ID: {
    code: 6006,
    msg: '❗️이미 사용 중인 아이디입니다.❗️',
  },
  LOGIN_FAILED: {
    code: 6007,
    msg: '❗️아이디 또는 비밀번호가 일치하지 않습니다.❗️',
  },

  // 7. 거래 내역 조작 관련 (7000번대)
  TRANSACTION_CREATE_FAILED: {
    code: 7001,
    msg: '❗️내역을 추가하는 중에 오류가 발생했습니다. 다시 시도해주세요.❗️',
  },
  TRANSACTION_UPDATE_FAILED: {
    code: 7002,
    msg: '❗️내역을 수정하는 중에 오류가 발생했습니다. 다시 시도해주세요.❗️',
  },
  TRANSACTION_DELETE_FAILED: {
    code: 7003,
    msg: '❗️내역을 삭제하는 중에 오류가 발생했습니다. 다시 시도해주세요.❗️',
  },
  UNAUTHORIZED_ACCESS: {
    code: 7004,
    msg: '❗️해당 내역을 수정하거나 삭제할 권한이 없습니다.❗️',
  },
  DATA_SYNC_ERROR: {
    code: 7005,
    msg: '❗️서버 데이터와 일치하지 않습니다. 페이지를 새로고침 해주세요.❗️',
  },
};
