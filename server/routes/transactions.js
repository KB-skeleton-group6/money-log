import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  const { id: userId } = req.user;
  try {
    const transactions = db
      .prepare("SELECT * FROM transactions WHERE user_id = ?")
      .all(userId);
    return res.status(200).json(transactions);
  } catch (error) {
    console.error("트랜잭션 조회 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.get("/:id", (req, res) => {
  const { id: userId } = req.user;
  const transactionId = req.params.id;
  try {
    const transaction = db
      .prepare("SELECT * FROM transactions WHERE id = ?")
      .get(transactionId);
    if (!transaction) return res.status(404).json({ error: "Not found" });
    if (transaction.user_id !== userId)
      return res.status(403).json({ error: "Forbidden" });
    return res.status(200).json(transaction);
  } catch (error) {
    console.error("트랜잭션 조회 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.post("/", async (req, res) => {
  const { id: userId } = req.user;
  const {
    user_id,
    type,
    amount,
    category_id,
    detail,
    memo,
    method,
    transacted_at,
    created_at,
  } = req.body;
  if (user_id !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  try {
    const result = db
      .prepare(
        `INSERT INTO transactions (user_id, type, amount, category_id, detail, memo, method, transacted_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        user_id,
        type,
        amount,
        category_id,
        detail,
        memo,
        method,
        transacted_at,
        created_at,
      );
    return res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    console.error("트랜잭션 생성 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.put("/:id", (req, res) => {
  const { id: userId } = req.user;
  const transactionId = req.params.id;

  const {
    user_id,
    type,
    amount,
    category_id,
    detail,
    memo,
    method,
    transacted_at,
  } = req.body;

  try {
    const transaction = db
      .prepare("SELECT * FROM transactions WHERE id = ?")
      .get(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Not found" });
    }
    if (transaction.user_id !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    db.prepare(
      `UPDATE transactions SET user_id=?, type=?, amount=?, category_id=?, detail=?, memo=?, method=?, transacted_at=? WHERE id=?`,
    ).run(
      user_id,
      type,
      amount,
      category_id,
      detail,
      memo,
      method,
      transacted_at,
      transactionId,
    );
    const updated = db
      .prepare("SELECT * FROM transactions WHERE id = ?")
      .get(transactionId);
    return res.status(200).json(updated);
  } catch (error) {
    console.error("트랜잭션 업데이트 에러:", error);
    return res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

router.delete("/:id", (req, res) => {
  const { id: userId } = req.user;
  const transactionId = req.params.id;

  const transaction = db
    .prepare("SELECT * FROM transactions WHERE id = ?")
    .get(transactionId);
  if (!transaction) return res.status(404).json({ error: "Not found" });
  if (transaction.user_id !== userId)
    return res.status(403).json({ error: "Forbidden" });

  try {
    db.prepare("DELETE FROM transactions WHERE id = ?").run(transactionId);
    res.status(204).send();
  } catch (error) {
    console.error("트랜잭션 삭제 에러:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

export default router;
