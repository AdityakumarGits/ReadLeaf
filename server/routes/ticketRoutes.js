import { Router } from "express";
import { protect, adminOnly, authorOnly } from "../middleware/authMiddleware.js";
import { createTicket, getMyTickets, getTickets, getTicketById, updateTicket, sendReply, generateDraft } from "../controllers/ticketController.js";
const router = Router();




router.get("/mine", protect, authorOnly, getMyTickets);
router.post("/", protect, authorOnly, createTicket);
router.get("/", protect, adminOnly, getTickets);
router.get("/:id", protect, getTicketById);
router.patch("/:id", protect, adminOnly, updateTicket);
router.post("/:id/reply", protect, adminOnly, sendReply);
router.post("/:id/draft", protect, adminOnly, generateDraft);
export default router;
