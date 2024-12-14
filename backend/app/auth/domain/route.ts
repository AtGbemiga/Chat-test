import { Router } from "express";
import { createUser } from "../api/emailSignUp";
const router = Router();

router.post("/email-sign-up", createUser);

export default router;
