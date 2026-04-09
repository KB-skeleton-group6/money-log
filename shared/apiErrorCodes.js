export const ApiErrorCode = {
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS', // 로그인 실패 (이메일/비밀번호 불일치)
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',             // 토큰 없음/만료/유효하지 않음
  AUTH_PASSWORD_MISMATCH: 'AUTH_PASSWORD_MISMATCH',     // 현재 비밀번호 불일치 (reset-password)
  AUTH_DUPLICATE_EMAIL: 'AUTH_DUPLICATE_EMAIL',         // 이미 존재하는 이메일 (signup)
  AUTH_INVALID_INPUT: 'AUTH_INVALID_INPUT',             // 입력값 유효성 오류
};
