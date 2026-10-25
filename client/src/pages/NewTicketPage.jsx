import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api.js";

const NewTicketPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    bookId: "general",
    subject: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/books/mine")
      .then((res) => setBooks(res.data.books))
      .catch(() => {});
  }, []);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const response = await api.post("/tickets", form);
      setSuccess(
        `Ticket created. Category: ${response.data.ticket.category}; priority: ${response.data.ticket.priority}.`,
      );
      setTimeout(() => navigate("/tickets"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your ticket.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft size={16} /> Back to overview
      </Link>
      <div>
        <p className="eyebrow">We’re here to help</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          Start a conversation
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Tell us what’s happening. A support ticket helps our team keep the
          details and next steps together.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="panel space-y-6 p-5 sm:p-8">
        <div className="rounded-2xl bg-cream p-4">
          <div className="flex items-center gap-2 font-bold">
            <Sparkles size={17} /> Help us route your question
          </div>
          <p className="mt-1 text-sm leading-6 text-muted">
            We’ll suggest a category and priority automatically. A member of the
            team can review it before responding.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">
            Which book is this about?
          </label>
          <select
            className="field"
            name="bookId"
            value={form.bookId}
            onChange={handleChange}
          >
            <option value="general">General / Account Level</option>
            {books.map((book) => (
              <option key={book.book_id} value={book.book_id}>
                {book.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">Subject</label>
          <input
            className="field"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="e.g. Question about my latest royalty payment"
            maxLength={140}
            required
          />
          <p className="mt-1 text-right text-xs text-muted">
            {form.subject.length}/140
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">
            Tell us a little more
          </label>
          <textarea
            className="field min-h-40 resize-y"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Share the details that will help our team understand the issue…"
            maxLength={5000}
            required
          />
          <p className="mt-1 text-xs text-muted">
            Please avoid sharing passwords or sensitive banking information.
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold">
            Attachment{" "}
            <span className="font-normal text-muted">
              (optional, UI preview only)
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-rose-200 bg-[#fffaf8] p-4 text-sm text-muted hover:bg-blush/30">
            <Paperclip size={18} />
            <span>Choose a file to reference</span>
            <input
              type="file"
              className="sr-only"
              onChange={(event) =>
                event.target.files?.[0] &&
                setForm({ ...form, attachmentName: event.target.files[0].name })
              }
            />
            <span className="ml-auto text-xs">
              {form.attachmentName || "No file selected"}
            </span>
          </label>
        </div>
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 border-t border-rose-50 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs leading-5 text-muted">
            <ShieldCheck size={15} /> Only you and BookLeaf support can view
            this ticket.
          </p>
          <button className="btn-primary" disabled={busy}>
            {busy ? "Submitting…" : "Submit ticket"} <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewTicketPage;
