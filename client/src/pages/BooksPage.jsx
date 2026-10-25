import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Coins, Store } from "lucide-react";
import api from "../services/api.js";
import EmptyState from "../components/EmptyState.jsx";

const money = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(value);
const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/books/mine")
      .then((res) => setBooks(res.data.books))
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load books."),
      );
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="eyebrow">Your publishing journey</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
          My books
        </h1>
        <p className="mt-2 text-sm text-muted">
          Book details and royalty figures connected to your author profile.
        </p>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      {books.length === 0 ? (
        <div className="panel">
          <EmptyState
            title="No books yet"
            text="Your book records will appear here once they are linked to your account."
          />
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {books.map((book, index) => (
            <article key={book.book_id} className="panel overflow-hidden">
              <div
                className={`flex items-start gap-4 p-5 ${index % 2 ? "bg-cream/70" : "bg-blush/50"}`}
              >
                <div className="flex h-16 w-12 shrink-0 items-center justify-center rounded-lg border border-white bg-white shadow-sm">
                  <BookOpen size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">
                    {book.book_id} · {book.genre}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold">{book.title}</h2>
                  <p className="mt-1 break-all text-xs text-muted">
                    ISBN: {book.isbn || "Not assigned yet"}
                  </p>
                </div>
                <span className="max-w-28 rounded-full bg-white px-3 py-1 text-center text-[10px] font-bold leading-4">
                  {book.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-px bg-rose-50 sm:grid-cols-3">
                <div className="bg-white p-4">
                  <p className="text-xs text-muted">MRP</p>
                  <p className="mt-1 font-extrabold">{money(book.mrp)}</p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-muted">Copies sold</p>
                  <p className="mt-1 font-extrabold">
                    {(book.total_copies_sold || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-muted">Royalty earned</p>
                  <p className="mt-1 font-extrabold">
                    {money(book.total_royalty_earned)}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-muted">Royalty paid</p>
                  <p className="mt-1 font-extrabold">
                    {money(book.royalty_paid)}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-muted">Royalty pending</p>
                  <p className="mt-1 font-extrabold text-[#b45d79]">
                    {money(book.royalty_pending)}
                  </p>
                </div>
                <div className="bg-white p-4">
                  <p className="text-xs text-muted">Publication date</p>
                  <p className="mt-1 flex items-center gap-1 text-sm font-bold">
                    <CalendarDays size={13} />
                    {book.publication_date || "Pending"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 text-xs text-muted">
                <span className="flex items-center gap-2">
                  <Store size={14} />{" "}
                  {book.print_partner || "Print partner pending"}
                </span>
                <span>
                  Available on:{" "}
                  {book.available_on?.length
                    ? book.available_on.join(", ")
                    : "Not listed yet"}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
export default BooksPage;
