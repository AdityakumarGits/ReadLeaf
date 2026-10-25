import { Router } from "express";
import { getMyBooks } from "../controllers/bookController.js";
import { protect, authorOnly } from "../middleware/authMiddleware.js";
const router = Router();


router.get("/mine", protect, authorOnly, getMyBooks);
export default router;
