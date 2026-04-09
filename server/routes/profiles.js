import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/me", (req, res) => {
  const { id: userId } = req.user;
  try {
    const member = db.prepare("SELECT * FROM members WHERE id = ?").get(userId);
    if (!member) {
      return res.status(404).json({ error: "회원 정보를 찾을 수 없습니다." });
    }
    return res.status(200).json(member);
  } catch (error) {
    console.error("회원 정보 조회 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.get("/:id", (req, res) => {
  const { id: userId } = req.user;
  const id = req.params.id;
  if (userId !== id) {
    return res.status(403).json({ error: "권한이 없습니다." });
  }
  try {
    const member = db
      .prepare("SELECT * FROM members WHERE id = ?")
      .get(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "회원 정보를 찾을 수 없습니다." });
    }
    return res.status(200).json(member);
  } catch (error) {
    console.error("회원 정보 조회 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.put("/:id", (req, res) => {
  const { id: userId } = req.user;
  const id = req.params.id;
  if (userId !== id) {
    return res.status(403).json({ error: "권한이 없습니다." });
  }
  const { name } = req.body;
  try {
    isNameValid(name);
    db.prepare("UPDATE members SET name = ? WHERE id = ?").run(name, id);
    return res.status(200).json({ message: "이름 업데이트 성공" });
  } catch (error) {
    if (error instanceof InvalidNameException) {
      return res.status(400).json({ error: error.message });
    }
    console.error("이름 업데이트 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
