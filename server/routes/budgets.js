import { Router } from "express";
import db from "../db.js";

const router = Router();

// 지출 카테고리 전체 + 유저 예산 병합 조회
router.get("/", (req, res) => {
  const { id: userId } = req.user;
  try {
    const budgets = db
      .prepare(
        `SELECT c.id AS category_id, COALESCE(b.amount, 0) AS amount
         FROM categories c
         LEFT JOIN budgets b ON c.id = b.category_id AND b.user_id = ?
         WHERE c.type = 'EXPENSE'`,
      )
      .all(userId);
    return res.status(200).json(budgets);
  } catch (error) {
    console.error("예산 조회 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// 예산 일괄 upsert
// body: [{ category_id, amount }, ...]
router.put("/", (req, res) => {
  const { id: userId } = req.user;
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "유효하지 않은 요청입니다." });
  }

  const upsert = db.prepare(
    `INSERT INTO budgets (user_id, category_id, amount)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id, category_id) DO UPDATE SET amount = excluded.amount`,
  );

  const upsertAll = db.transaction((rows) => {
    for (const { category_id, amount } of rows) {
      upsert.run(userId, category_id, amount);
    }
  });

  try {
    upsertAll(items);
    return res.status(200).json({ message: "저장되었습니다." });
  } catch (error) {
    console.error("예산 저장 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
