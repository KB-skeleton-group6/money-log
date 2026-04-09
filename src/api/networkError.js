import { ErrorCode } from "@/constant/errorCode";

export class NetworkError extends Error {
  constructor(errorInfo) {
    super(errorInfo.msg);
    this.name = "NetworkError";
    this.code = errorInfo.code;
  }
}

export class FetchFailedError extends NetworkError {
  constructor() {
    super(ErrorCode.FETCH_FAILED);
  }
}

export class SaveFailedError extends NetworkError {
  constructor() {
    super(ErrorCode.SAVE_FAILED);
  }
}

export class NetworkOfflineError extends NetworkError {
  constructor() {
    super(ErrorCode.NETWORK_OFFLINE);
  }
}

export class ServerTimeoutError extends NetworkError {
  constructor() {
    super(ErrorCode.SERVER_TIMEOUT);
  }
}

export class ApiError extends Error {
  constructor(serverErrorCode) {
    super(serverErrorCode);
    this.name = 'ApiError';
    this.serverErrorCode = serverErrorCode;
  }
}
