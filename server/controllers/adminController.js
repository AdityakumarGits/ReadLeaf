import Author from "../models/Author.js";
import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export const getStats = async (req, res, next) => {
  try {
    const [authors, books, tickets, open, progress, resolved] =
      await Promise.all([
        Author.countDocuments(),
        Author.aggregate([
          { $project: { count: { $size: "$books" } } },
          { $group: { _id: null, total: { $sum: "$count" } } },
        ]),
        Ticket.countDocuments(),
        Ticket.countDocuments({ status: "Open" }),
        Ticket.countDocuments({ status: "In Progress" }),
        Ticket.countDocuments({ status: "Resolved" }),
      ]);
    res.json({
      authors,
      books: books[0]?.total || 0,
      tickets,
      open,
      progress,
      resolved,
    });
  } catch (error) {
    next(error);
  }
};
