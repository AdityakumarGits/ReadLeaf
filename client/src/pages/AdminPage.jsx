import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Search,
  SlidersHorizontal,
  Users,
  RefreshCw,
  Sparkles,
  Send,
  StickyNote,
  UserRoundCheck,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";

const statuses = ["Open", "In Progress", "Resolved", "Closed"];
const categories = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
];
const priorities = ["Critical", "High", "Medium", "Low"];

const AdminPage = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    authors: 0,
    books: 0,
    tickets: 0,
    open: 0,
    progress: 0,
    resolved: 0,
  });
  const [filters, setFilters] = useState({
    status: "All",
    category: "All",
    priority: "All",
    search: "",
  });
  const [selectedId, setSelectedId] = useState("");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const load = async () => {
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([key, value]) =>
          key === "search" ? value.trim() : value !== "All",
        ),
      );
      const [ticketResponse, statResponse] = await Promise.all([
        api.get("/tickets", { params }),
        api.get("/admin/stats"),
      ]);
      setTickets(ticketResponse.data.tickets);
      setStats(statResponse.data);
      setError("");
      const queryId = searchParams.get("selected");
      const wantedId = queryId || selectedId;
      const found = ticketResponse.data.tickets.find(
        (ticket) => ticket._id === wantedId,
      );
      if (found) setSelected(found);
      else if (!wantedId && ticketResponse.data.tickets.length) {
        setSelectedId(ticketResponse.data.tickets[0]._id);
        setSelected(ticketResponse.data.tickets[0]);
      } else if (wantedId && !found) setSelected(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load admin ticket queue.",
      );
    }
  };

  useEffect(() => {
    load();
  }, [filters.status, filters.category, filters.priority, filters.search]);
  useEffect(() => {
    const timer = setInterval(load, 8000);
    return () => clearInterval(timer);
  }, [filters, selectedId, searchParams]);

  const chooseTicket = (ticket) => {
    setSelectedId(ticket._id);
    setSelected(ticket);
    setReply("");
    setMessage("");
    setSearchParams({ selected: ticket._id });
  };

  const updateTicket = async (updates) => {
    if (!selected) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await api.patch(`/tickets/${selected._id}`, updates);
      setSelected(response.data.ticket);
      setMessage("Ticket updated.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update ticket.");
    } finally {
      setBusy(false);
    }
  };

  const createDraft = async () => {
    if (!selected) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post(`/tickets/${selected._id}/draft`);
      setReply(response.data.draft);
      setMessage(
        `Draft ready (${response.data.source === "gemini" ? "Gemini AI" : "fallback template"}). Review before sending.`,
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not create draft.");
    } finally {
      setBusy(false);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await api.post(`/tickets/${selected._id}/reply`, {
        message: reply,
      });
      setSelected(response.data.ticket);
      setReply("");
      setMessage("Reply sent to the author.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reply.");
    } finally {
      setBusy(false);
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    await updateTicket({ internalNote: note });
    setNote("");
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight">
            Support, made clearer.
          </h1>
          <p className="mt-2 text-sm text-muted">
            Prioritise the right issue, keep context close, and send a
            thoughtful answer.
          </p>
        </div>
        <button onClick={load} className="btn-soft self-start">
          <RefreshCw size={16} /> Refresh queue
        </button>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total authors"
          value={stats.authors}
          detail={`${stats.books} books in sample catalog`}
          icon={Users}
          tone="pink"
        />
        <StatCard
          label="All support tickets"
          value={stats.tickets}
          detail="Across every author"
          icon={SlidersHorizontal}
          tone="cream"
        />
        <StatCard
          label="Awaiting first action"
          value={stats.open}
          detail="Open tickets"
          icon={AlertTriangle}
          tone="peach"
        />
        <StatCard
          label="Resolved"
          value={stats.resolved}
          detail={`${stats.progress} currently in progress`}
          icon={CheckCircle2}
          tone="white"
        />
      </section>
      {error && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}
      {message && (
        <p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}
        </p>
      )}

      <div className="grid items-start gap-6 2xl:grid-cols-[minmax(340px,.85fr)_minmax(0,1.15fr)]">
        <section className="panel min-w-0 overflow-hidden">
          <div className="border-b border-rose-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Incoming requests</p>
                <h2 className="mt-1 text-lg font-extrabold">Ticket queue</h2>
              </div>
              <span className="rounded-full bg-cream px-3 py-1 text-xs font-bold">
                {tickets.length} shown
              </span>
            </div>
            <div className="relative mt-4">
              <Search
                size={16}
                className="absolute left-3 top-3.5 text-muted"
              />
              <input
                className="field pl-9"
                placeholder="Search author or subject…"
                value={filters.search}
                onChange={(event) =>
                  setFilters({ ...filters, search: event.target.value })
                }
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <select
                className="field !py-2.5"
                value={filters.status}
                onChange={(event) =>
                  setFilters({ ...filters, status: event.target.value })
                }
              >
                <option>All</option>
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                className="field !py-2.5"
                value={filters.priority}
                onChange={(event) =>
                  setFilters({ ...filters, priority: event.target.value })
                }
              >
                <option>All</option>
                {priorities.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                className="field col-span-2 !py-2.5"
                value={filters.category}
                onChange={(event) =>
                  setFilters({ ...filters, category: event.target.value })
                }
              >
                <option>All</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
          {tickets.length ? (
            <div className="max-h-[800px] overflow-y-auto">
              {tickets.map((ticket) => (
                <button
                  key={ticket._id}
                  onClick={() => chooseTicket(ticket)}
                  className={`block w-full border-b border-rose-50 px-5 py-4 text-left transition last:border-0 ${selected?._id === ticket._id ? "bg-blush/50" : "hover:bg-[#fffaf8]"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted">
                        {ticket.authorName} · {ticket.bookTitle}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="mt-1 shrink-0 text-muted"
                    />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge value={ticket.priority} />
                    <StatusBadge value={ticket.status} />
                    <span className="text-[11px] text-muted">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-xs text-muted">
                    {ticket.category}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching tickets"
              text="Try changing a filter or search term."
            />
          )}
        </section>

        <section className="panel min-w-0 overflow-hidden">
          {!selected ? (
            <EmptyState
              title="Choose a ticket"
              text="Select a request from the queue to review the issue, adjust priority, and respond."
            />
          ) : (
            <>
              <div className="border-b border-rose-50 bg-cream/70 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">Ticket detail</p>
                    <h2 className="mt-2 text-xl font-extrabold">
                      {selected.subject}
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      {selected.authorName} · {selected.authorEmail}
                    </p>
                  </div>
                  <StatusBadge value={selected.priority} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-white px-3 py-2 font-semibold">
                    {selected.bookTitle}
                  </span>
                  <span className="rounded-full bg-white px-3 py-2 font-semibold">
                    {new Date(selected.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="space-y-6 p-5 sm:p-6">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
                    Author’s message
                  </p>
                  <p className="whitespace-pre-wrap rounded-2xl border border-rose-100 bg-[#fffaf8] p-4 text-sm leading-7">
                    {selected.description}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
                      Category · editable
                    </label>
                    <select
                      className="field"
                      value={selected.category}
                      onChange={(event) =>
                        updateTicket({ category: event.target.value })
                      }
                    >
                      {categories.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
                      Priority · editable
                    </label>
                    <select
                      className="field"
                      value={selected.priority}
                      onChange={(event) =>
                        updateTicket({ priority: event.target.value })
                      }
                    >
                      {priorities.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
                      Ticket status
                    </label>
                    <select
                      className="field"
                      value={selected.status}
                      onChange={(event) =>
                        updateTicket({ status: event.target.value })
                      }
                    >
                      {statuses.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted">
                      Assigned to
                    </label>
                    <input
                      className="field"
                      value={selected.assignedTo || ""}
                      onChange={(event) =>
                        setSelected({
                          ...selected,
                          assignedTo: event.target.value,
                        })
                      }
                      onBlur={() =>
                        updateTicket({ assignedTo: selected.assignedTo || "" })
                      }
                      placeholder="Name of support teammate"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-100 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-extrabold">
                        <StickyNote size={16} /> Internal notes
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Visible to the operations team only.
                      </p>
                    </div>
                    <UserRoundCheck size={18} className="text-muted" />
                  </div>
                  {selected.internalNotes?.length > 0 && (
                    <ul className="mt-3 space-y-2">
                      {selected.internalNotes.map((item, index) => (
                        <li
                          key={`${index}-${item}`}
                          className="rounded-lg bg-cream p-3 text-sm"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-3 flex gap-2">
                    <input
                      className="field"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      placeholder="Add a private note…"
                    />
                    <button
                      className="btn-soft shrink-0"
                      onClick={addNote}
                      disabled={busy || !note.trim()}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-extrabold">
                        <Sparkles size={17} /> AI response draft
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Review and edit the draft before sending it to the
                        author.
                      </p>
                    </div>
                    <button
                      className="btn-soft"
                      onClick={createDraft}
                      disabled={busy}
                    >
                      <Sparkles size={15} />{" "}
                      {busy ? "Working…" : "Generate draft"}
                    </button>
                  </div>
                  <form onSubmit={sendReply} className="mt-3 space-y-3">
                    <textarea
                      className="field min-h-48 resize-y leading-6"
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      placeholder="Generate a draft or write your own reply…"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs leading-5 text-muted">
                        AI drafts can be wrong. Confirm any policy details
                        before sending.
                      </p>
                      <button
                        className="btn-primary"
                        disabled={busy || !reply.trim()}
                      >
                        <Send size={15} /> Send reply
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <p className="mb-3 text-sm font-extrabold">
                    Previous replies
                  </p>
                  {selected.replies?.length ? (
                    selected.replies.map((item) => (
                      <div
                        key={item._id}
                        className="mb-2 rounded-xl bg-[#fffaf8] p-3"
                      >
                        <p className="text-xs font-bold">
                          {item.senderName}{" "}
                          <span className="font-normal text-muted">
                            · {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
                          {item.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      No replies have been sent yet.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted">
        <Clock3 size={14} /> Queue refreshes every 8 seconds. Keep urgent or
        overdue issues visible and give authors a concrete next step.
      </div>
    </div>
  );
};
export default AdminPage;
