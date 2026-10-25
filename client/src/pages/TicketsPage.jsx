import { useEffect, useState } from "react";
import { MessageSquareText, Plus, RefreshCw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import TicketRow from "../components/TicketRow.jsx";
import EmptyState from "../components/EmptyState.jsx";

const TicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("selected");

  const loadTickets = async () => {
    try {
      const response = await api.get("/tickets/mine");
      setTickets(response.data.tickets);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not load tickets.");
    }
  };
  useEffect(() => {
    loadTickets();
    const timer = setInterval(loadTickets, 8000);
    return () => clearInterval(timer);
  }, []);

  const visible = tickets.filter(
    (ticket) => filter === "All" || ticket.status === filter,
  );
  const selected = tickets.find((ticket) => ticket._id === selectedId);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Your support history</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            My tickets
          </h1>
          <p className="mt-2 text-sm text-muted">
            Ticket updates refresh automatically while this page is open.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadTickets} className="btn-soft">
            <RefreshCw size={16} /> Refresh
          </button>
          <Link to="/new-ticket" className="btn-primary">
            <Plus size={16} /> New ticket
          </Link>
        </div>
      </div>
      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      {selected && (
        <section className="panel overflow-hidden border-rose-200">
          <div className="flex items-start justify-between gap-3 bg-cream p-5">
            <div>
              <p className="eyebrow">Ticket details</p>
              <h2 className="mt-1 text-lg font-extrabold">
                {selected.subject}
              </h2>
              <p className="mt-1 text-xs text-muted">
                {selected.bookTitle} ·{" "}
                {new Date(selected.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => window.history.replaceState({}, "", "/tickets")}
              className="text-xs font-bold underline"
            >
              Close
            </button>
          </div>
          <div className="space-y-4 p-5">
            <div className="rounded-xl bg-[#fffaf8] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Your message
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                {selected.description}
              </p>
            </div>
            <div>
              <p className="mb-3 text-sm font-bold">Replies from BookLeaf</p>
              {selected.replies?.length ? (
                selected.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className="mb-3 rounded-xl border border-rose-100 p-4"
                  >
                    <p className="text-xs font-bold">
                      {reply.senderName}{" "}
                      <span className="font-normal text-muted">
                        · {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                      {reply.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">
                  No reply yet. We’ll add the team’s response here.
                </p>
              )}
            </div>
          </div>
        </section>
      )}
      <div className="flex flex-wrap gap-2">
        {["All", "Open", "In Progress", "Resolved", "Closed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-full px-4 py-2 text-xs font-bold ${filter === status ? "bg-ink text-white" : "bg-white text-muted ring-1 ring-rose-100 hover:bg-cream"}`}
          >
            {status}
            {status === "All"
              ? ` · ${tickets.length}`
              : ` · ${tickets.filter((ticket) => ticket.status === status).length}`}
          </button>
        ))}
      </div>
      <section className="panel overflow-hidden">
        <div className="flex items-center gap-3 border-b border-rose-50 px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush">
            <MessageSquareText size={18} />
          </div>
          <div>
            <h2 className="font-extrabold">Conversation history</h2>
            <p className="text-xs text-muted">
              {visible.length} {visible.length === 1 ? "ticket" : "tickets"}
            </p>
          </div>
        </div>
        {visible.length ? (
          visible.map((ticket) => (
            <TicketRow key={ticket._id} ticket={ticket} />
          ))
        ) : (
          <EmptyState
            title="No tickets in this view"
            text={
              filter === "All"
                ? "If you need a hand, open a ticket and our team will help you work through it."
                : `There are no ${filter.toLowerCase()} tickets right now.`
            }
            action={
              filter === "All" ? (
                <Link to="/new-ticket" className="btn-soft">
                  Create a ticket
                </Link>
              ) : null
            }
          />
        )}
      </section>
    </div>
  );
};
export default TicketsPage;
