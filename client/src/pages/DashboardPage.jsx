import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Coins,
  MessageSquareText,
  Plus,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import TicketRow from "../components/TicketRow.jsx";
import EmptyState from "../components/EmptyState.jsx";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/books/mine"), api.get("/tickets/mine")])
      .then(([bookResponse, ticketResponse]) => {
        setBooks(bookResponse.data.books);
        setTickets(ticketResponse.data.tickets);
      })
      .catch((err) =>
        setError(
          err.response?.data?.message || "Could not load your dashboard.",
        ),
      );
  }, []);

  const pending = books.reduce(
    (sum, book) => sum + (book.royalty_pending || 0),
    0,
  );
  const sales = books.reduce(
    (sum, book) => sum + (book.total_copies_sold || 0),
    0,
  );
  const active = tickets.filter(
    (ticket) => !["Resolved", "Closed"].includes(ticket.status),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="relative overflow-hidden rounded-3xl bg-roseleaf p-6 sm:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow">Your author space</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            A little more clarity,{" "}
            <span className="text-[#9d536c]">every chapter.</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#795d67]">
            Your publishing journey keeps moving. Here’s a simple view of your
            books, royalties and conversations with our team.
          </p>
          <Link to="/new-ticket" className="btn-primary mt-6">
            <Plus size={17} /> Start a conversation
          </Link>
        </div>
        <div className="absolute -right-12 -top-16 h-60 w-60 rounded-full border-[35px] border-white/25" />
        <div className="absolute bottom-0 right-20 hidden h-24 w-24 rounded-t-full bg-[#FFF4DE] sm:block" />
      </section>

      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Books in your shelf"
          value={books.length}
          detail="Across all publishing stages"
          icon={BookOpen}
          tone="pink"
        />
        <StatCard
          label="Copies sold"
          value={sales.toLocaleString("en-IN")}
          detail="Total reported copies"
          icon={Sparkles}
          tone="cream"
        />
        <StatCard
          label="Royalty pending"
          value={money(pending)}
          detail="Based on your book records"
          icon={Coins}
          tone="peach"
        />
        <StatCard
          label="Active conversations"
          value={active.length}
          detail={`${tickets.length} tickets submitted`}
          icon={MessageSquareText}
          tone="white"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-rose-50 px-5 py-5">
            <div>
              <p className="eyebrow">Your bookshelf</p>
              <h2 className="mt-1 text-lg font-extrabold">
                Recently published
              </h2>
            </div>
            <Link
              to="/books"
              className="flex items-center gap-1 text-sm font-bold"
            >
              All books <ArrowRight size={15} />
            </Link>
          </div>
          {books.length === 0 ? (
            <EmptyState
              title="Your shelf is ready"
              text="When your books are connected to your author account, they will appear here."
            />
          ) : (
            books.slice(0, 3).map((book) => (
              <div
                key={book.book_id}
                className="flex items-center gap-4 border-b border-rose-50 px-5 py-4 last:border-0"
              >
                <div className="flex h-14 w-11 shrink-0 items-center justify-center rounded-lg bg-cream">
                  <BookOpen size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{book.title}</p>
                  <p className="mt-1 truncate text-xs text-muted">
                    {book.genre} · {book.book_id}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold ${book.status === "Published & Live" ? "bg-emerald-50 text-emerald-700" : "bg-cream text-ink"}`}
                >
                  {book.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-rose-50 px-5 py-5">
            <p className="eyebrow">Stay in the loop</p>
            <h2 className="mt-1 text-lg font-extrabold">
              Recent conversations
            </h2>
          </div>
          {tickets.length === 0 ? (
            <EmptyState
              title="Nothing waiting on you"
              text="If you need help with a book or royalty, start a support ticket and our team will take it from there."
              action={
                <Link className="btn-soft" to="/new-ticket">
                  Create a ticket
                </Link>
              }
            />
          ) : (
            tickets
              .slice(0, 3)
              .map((ticket) => <TicketRow key={ticket._id} ticket={ticket} />)
          )}
          {tickets.length > 0 && (
            <div className="p-4">
              <Link className="btn-soft w-full" to="/tickets">
                View all tickets <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default DashboardPage;
