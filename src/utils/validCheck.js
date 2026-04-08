import { ErrorCode } from '@/constants/errorCode';

// 가계부 전용 커스텀 에러 클래스
export class TransactionError extends Error {
  constructor(errorInfo) {
    super(errorInfo.msg);
    this.name = 'TransactionError';
    this.code = errorInfo.code;
  }
}

// 정규식 정의
const AMOUNT_REGEX = /^\d+$/; // 숫자만
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD 형식

/**
 * 금액 유효성 검사
 */
export function isAmountValid(amount) {
  const strAmount = String(amount);

  if (!AMOUNT_REGEX.test(strAmount)) {
    throw new TransactionError(ErrorCode.INVALID_AMOUNT_FORMAT);
  }

  const numericAmount = Number(amount);
  if (numericAmount <= 0) {
    throw new TransactionError(ErrorCode.ZERO_AMOUNT_NOT_ALLOWED);
  }
  if (numericAmount > 1000000000) {
    // 10억 제한
    throw new TransactionError(ErrorCode.AMOUNT_OUT_OF_RANGE);
  }

  return true;
}

/**
 * 날짜 유효성 검사 (형식 및 미래 날짜 여부)
 */
export function isDateValid(dateStr) {
  if (!DATE_REGEX.test(dateStr)) {
    throw new TransactionError(ErrorCode.INVALID_DATE_FORMAT);
  }

  const inputDate = new Date(dateStr);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // 오늘 날짜 끝 시간으로 설정

  if (inputDate > today) {
    throw new TransactionError(ErrorCode.FUTURE_DATE_NOT_ALLOWED);
  }

  return true;
}

/**
 * 메모 길이 검사
 */
export function isMemoValid(memo) {
  if (memo && memo.length > 100) {
    throw new TransactionError(ErrorCode.MEMO_TOO_LONG);
  }
  return true;
}

/**
 * 필수 필드 누락 검사 (통합형)
 */
export function checkRequiredFields(fields) {
  for (const [key, value] of Object.entries(fields)) {
    if (value === null || value === undefined || value === '') {
      throw new TransactionError(ErrorCode.REQUIRED_FIELD_MISSING);
    }
  }
  return true;
}
