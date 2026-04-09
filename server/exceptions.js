export class AuthException extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthException";
  }
}

export class InvalidEmailException extends AuthException {
  constructor() {
    super("유효하지 않은 이메일 형식입니다.");
  }
}

export class InvalidPasswordException extends AuthException {
  constructor() {
    super("유효하지 않은 비밀번호 형식입니다.");
  }
}

export class InvalidNameException extends AuthException {
  constructor() {
    super("유효하지 않은 이름 형식입니다.");
  }
}
