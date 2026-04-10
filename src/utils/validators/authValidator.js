import { ErrorCode } from '@/constant/errorCode';

export class MemberInfoError extends Error {
  constructor(errorInfo) {
    super(errorInfo.msg);
    this.name = 'MemberInfoError';
    this.code = errorInfo.code;
  }
}

// 정규식 정의
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,20}$/; // 영문, 숫자, 특수문자 포함 8~20자
const NAME_REGEX = /^[가-힣a-zA-Z\s]{1,12}$/; // 한글, 영문, 공백만 허용, 12자 이하

/**
 * 이메일 유효성 검사
 */
export function isEmailValid(email) {
  if (!email || email.trim() === '') {
    throw new MemberInfoError(ErrorCode.EMPTY_EMAIL_FIELD);
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new MemberInfoError(ErrorCode.INVALID_EMAIL_FORMAT);
  }
  return true;
}

/**
 * 비밀번호 유효성 검사
 */
export function isPasswordValid(password) {
  if (!password || password.trim() === '') {
    throw new MemberInfoError(ErrorCode.EMPTY_PASSWORD_FIELD);
  }
  if (!PASSWORD_REGEX.test(password)) {
    throw new MemberInfoError(ErrorCode.INVALID_PASSWORD_FORMAT);
  }
  return true;
}

/**
 * 비밀번호 확인 일치 검사
 */
export function isPasswordConfirmed(password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new MemberInfoError(ErrorCode.PASSWORD_MISMATCH);
  }
  return true;
}

/**
 * 이름 유효성 검사
 */
export function isNameValid(name) {
  if (!name || name.trim() === '') {
    throw new MemberInfoError(ErrorCode.EMPTY_NAME_FIELD);
  }
  if (!NAME_REGEX.test(name)) {
    throw new MemberInfoError(ErrorCode.INVALID_NAME_FORMAT);
  }
  return true;
}
