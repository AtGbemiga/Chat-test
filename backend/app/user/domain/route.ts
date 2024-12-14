import { Router } from "express";
import { searchUser } from "../api/search";

const router = Router();
router.post("/search", searchUser);

export default router;
