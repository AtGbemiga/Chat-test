import { Router } from "express";
import { getUserId } from "../api/getUserId";
const router = Router();

router.route("/getUserId").get(getUserId);

export default router;
