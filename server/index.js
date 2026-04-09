import express from "express";
import cors from "cors";
import profilesRouter from "./routes/profiles.js";
import transactionsRouter from "./routes/transactions.js";
import authRouter from "./routes/auth.js";
import { authenticate } from "./middleware/auth.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/profiles", authenticate, profilesRouter);
app.use("/transactions", authenticate, transactionsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
