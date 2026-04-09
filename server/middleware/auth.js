import { verifyToken } from "../utils/auth/jwtUtil.js";
import { ApiErrorCode } from "../../shared/apiErrorCodes.js";

export const authenticate = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ errorCode: ApiErrorCode.AUTH_TOKEN_INVALID, error: "Unauthorized" });
  }
  const token = authorizationHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ errorCode: ApiErrorCode.AUTH_TOKEN_INVALID, error: "Unauthorized" });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    console.error("토큰 인증 에러:", error);
    return res
      .status(401)
      .json({ errorCode: ApiErrorCode.AUTH_TOKEN_INVALID, error: "Unauthorized" });
  }
};
