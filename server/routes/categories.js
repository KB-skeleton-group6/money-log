import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  try {
    const categories = db.prepare("SELECT * FROM categories").all();
    return res.status(200).json(categories);
  } catch (error) {
    console.error("카테고리 조회 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
