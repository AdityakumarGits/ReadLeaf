import Ticket from "../models/Ticket.js";
import { classifyTicket, draftReply } from "../services/aiService.js";

export const createTicket = async (req, res, next) => {
  try {
    const { bookId = "general", subject, description } = req.body;
    if (!subject?.trim() || !description?.trim()) {
      return res
        .status(400)
        .json({ message: "Subject and description are required." });
    }
    if (subject.trim().length > 140)
      return res
        .status(400)
        .json({ message: "Subject must be 140 characters or fewer." });
    if (description.trim().length > 5000)
      return res
        .status(400)
        .json({ message: "Description must be 5,000 characters or fewer." });
    const author = req.user.authorId;
    if (!author)
      return res
        .status(400)
        .json({ message: "This account is not linked to an author profile." });
    let bookTitle = "General / Account Level";
    if (bookId !== "general") {
      const book = author.books.find((item) => item.book_id === bookId);
      if (!book)
        return res
          .status(400)
          .json({ message: "Please select a valid book from your account." });
      bookTitle = book.title;
    }
    const ai = await classifyTicket(subject.trim(), description.trim());
    const ticket = await Ticket.create({
      author: author._id,
      authorName: req.user.name,
      authorEmail: req.user.email,
      bookId,
      bookTitle,
      subject: subject.trim(),
      description: description.trim(),
      category: ai.category,
      priority: ai.priority,
    });
    res.status(201).json({ ticket, aiSource: ai.source });
  } catch (error) {
    next(error);
  }
};

export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({
      author: req.user.authorId?._id || req.user.authorId,
    }).sort({ createdAt: -1 });
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const { status, category, priority, search } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (category && category !== "All") filter.category = category;
    if (priority && priority !== "All") filter.priority = priority;
    if (search)
      filter.$or = [
        { subject: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
        { authorEmail: { $regex: search, $options: "i" } },
      ];
    const tickets = await Ticket.find(filter).sort({ createdAt: 1 });
    res.json({ tickets });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    const ownerId = String(ticket.author);
    const userAuthorId = String(
      req.user.authorId?._id || req.user.authorId || "",
    );
    if (req.user.role !== "admin" && ownerId !== userAuthorId) {
      return res
        .status(403)
        .json({ message: "You can only view your own tickets." });
    }
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    const { status, category, priority, assignedTo, internalNote } = req.body;
    const allowedStatus = ["Open", "In Progress", "Resolved", "Closed"];
    const allowedCategory = [
      "Royalty & Payments",
      "ISBN & Metadata Issues",
      "Printing & Quality",
      "Distribution & Availability",
      "Book Status & Production Updates",
      "General Inquiry",
    ];
    const allowedPriority = ["Critical", "High", "Medium", "Low"];
    if (status && !allowedStatus.includes(status))
      return res.status(400).json({ message: "Invalid ticket status." });
    if (category && !allowedCategory.includes(category))
      return res.status(400).json({ message: "Invalid ticket category." });
    if (priority && !allowedPriority.includes(priority))
      return res.status(400).json({ message: "Invalid ticket priority." });
    if (status) ticket.status = status;
    if (category) ticket.category = category;
    if (priority) ticket.priority = priority;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    if (internalNote?.trim()) ticket.internalNotes.push(internalNote.trim());
    await ticket.save();
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const sendReply = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message?.trim())
      return res
        .status(400)
        .json({ message: "Reply message cannot be empty." });
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    ticket.replies.push({
      message: message.trim(),
      senderRole: "admin",
      senderName: req.user.name,
    });
    if (ticket.status === "Open") ticket.status = "In Progress";
    await ticket.save();
    res.json({ ticket });
  } catch (error) {
    next(error);
  }
};

export const generateDraft = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found." });
    const result = await draftReply(ticket);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
