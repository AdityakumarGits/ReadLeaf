import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  senderRole: { type: String, enum: ["author", "admin"], required: true },
  senderName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    authorName: { type: String, required: true },
    authorEmail: { type: String, required: true },
    bookId: { type: String, default: "general" },
    bookTitle: { type: String, default: "General / Account Level" },
    subject: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: String, default: "General Inquiry" },
    priority: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    assignedTo: { type: String, default: "" },
    internalNotes: { type: [String], default: [] },
    replies: { type: [replySchema], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model("Ticket", ticketSchema);
