import express from "express";
import { getAccountTransactions, createUser, getAllUsers } from "../Controllers/AccountsController";

const router = express.Router();

router.get("/:accountId/transactions", getAccountTransactions);
router.post("/createUser", createUser);
router.get("/getAllUsers", getAllUsers);

export default router;
