import { Router } from "express";
import db from "../db.js";
import { hashPassword, matchPassword } from "../utils/auth/encryption.js";
import {
  isEmailValid,
  isNameValid,
  isPasswordValid,
} from "../utils/auth/validator.js";
import dayjs from "dayjs";
import { authenticate } from "../middleware/auth.js";
import { issueToken } from "../utils/auth/jwtUtil.js";
import { AuthException } from "../exceptions.js";
import { ApiErrorCode } from "../../shared/apiErrorCodes.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ errorCode: ApiErrorCode.AUTH_INVALID_INPUT, error: "이메일과 비밀번호를 입력해주세요." });
  }
  try {
    const member = db
      .prepare("SELECT * FROM members WHERE email = ?")
      .get(email);
    if (!member) {
      // 보안상 이메일 존재 여부를 노출하지 않음
      return res
        .status(401)
        .json({ errorCode: ApiErrorCode.AUTH_INVALID_CREDENTIALS, error: "이메일 또는 비밀번호가 일치하지 않습니다." });
    }
    if (!(await matchPassword(password, member.password))) {
      return res
        .status(401)
        .json({ errorCode: ApiErrorCode.AUTH_INVALID_CREDENTIALS, error: "이메일 또는 비밀번호가 일치하지 않습니다." });
    } else {
      const token = issueToken({
        id: member.id,
        email: member.email,
        name: member.name,
      });
      res.setHeader("Authorization", `Bearer ${token}`);
      return res.status(200).json({ message: "로그인 성공" });
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    isEmailValid(email);
    isNameValid(name);
    isPasswordValid(password);
    const member = db
      .prepare("SELECT * FROM members WHERE email = ?")
      .get(email);
    if (member) {
      return res
        .status(409)
        .json({ errorCode: ApiErrorCode.AUTH_DUPLICATE_EMAIL, error: "이미 존재하는 이메일입니다." });
    }
    const createdAt = dayjs().toISOString();
    const hashedPassword = await hashPassword(password);
    const result = db
      .prepare(
        "INSERT INTO members (email, password, name, created_at) VALUES (?, ?, ?, ?)",
      )
      .run(email, hashedPassword, name, createdAt);
    return res.status(201).json({
      id: result.lastInsertRowid,
      email,
      name,
      created_at: createdAt,
    });
  } catch (error) {
    if (error instanceof AuthException) {
      return res
        .status(400)
        .json({ errorCode: ApiErrorCode.AUTH_INVALID_INPUT, error: error.message });
    }
    console.error("회원가입 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/reset-password", authenticate, async (req, res) => {
  const { id } = req.user;

  const { current_password: currentPassword, new_password: newPassword } =
    req.body;
  try {
    isPasswordValid(newPassword);

    const member = db.prepare("SELECT * FROM members WHERE id = ?").get(id);
    if (!member) {
      return res
        .status(401)
        .json({ errorCode: ApiErrorCode.AUTH_INVALID_CREDENTIALS, error: "회원 정보를 찾을 수 없습니다." });
    }
    if (!(await matchPassword(currentPassword, member.password))) {
      return res
        .status(401)
        .json({ errorCode: ApiErrorCode.AUTH_PASSWORD_MISMATCH, error: "비밀번호가 일치하지 않습니다." });
    } else {
      const hashedPassword = await hashPassword(newPassword);
      db.prepare("UPDATE members SET password = ? WHERE id = ?").run(
        hashedPassword,
        id,
      );
      return res.status(200).json({ message: "비밀번호 재설정 성공" });
    }
  } catch (error) {
    if (error instanceof AuthException) {
      return res
        .status(400)
        .json({ errorCode: ApiErrorCode.AUTH_INVALID_INPUT, error: error.message });
    }
    console.error("비밀번호 재설정 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/withdraw", authenticate, async (req, res) => {
  const { id } = req.user;
  try {
    db.prepare("DELETE FROM members WHERE id = ?").run(id);
    return res.status(204).send();
  } catch (error) {
    console.error("회원 탈퇴 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
