import { ApiErrorCode } from '@shared/apiErrorCodes';
import { ErrorCode } from '@/constant/errorCode';

export const resolveApiError = (serverErrorCode) => {
  switch (serverErrorCode) {
    case ApiErrorCode.AUTH_INVALID_CREDENTIALS:
      return ErrorCode.LOGIN_FAILED;
    case ApiErrorCode.AUTH_TOKEN_INVALID:
      return ErrorCode.SESSION_EXPIRED;
    case ApiErrorCode.AUTH_PASSWORD_MISMATCH:
      return ErrorCode.PASSWORD_MISMATCH;
    case ApiErrorCode.AUTH_DUPLICATE_EMAIL:
      return ErrorCode.DUPLICATE_EMAIL;
    case ApiErrorCode.AUTH_INVALID_INPUT:
      return ErrorCode.REQUIRED_FIELD_MISSING;
    default:
      return ErrorCode.FETCH_FAILED;
  }
};
