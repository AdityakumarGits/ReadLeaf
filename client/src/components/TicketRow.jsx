import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

const TicketRow = ({ ticket, admin = false }) => (
  <Link
    to={
      admin
        ? `/admin/tickets?selected=${ticket._id}`
        : `/tickets?selected=${ticket._id}`
    }
    className="grid gap-3 border-b border-rose-50 px-5 py-4 transition last:border-b-0 hover:bg-[#fff9f7] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
  >
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <p className="truncate font-bold">{ticket.subject}</p>
        <StatusBadge value={ticket.priority} />
      </div>
      <p className="mt-1 truncate text-sm text-muted">
        {admin ? `${ticket.authorName} · ` : ""}
        {ticket.bookTitle}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="flex items-center gap-1">
          <CalendarDays size={13} />
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
        <span>{ticket.category}</span>
      </div>
    </div>
    <div className="flex items-center justify-between gap-3 sm:justify-end">
      <StatusBadge value={ticket.status} />
      <ArrowUpRight size={17} className="text-muted" />
    </div>
  </Link>
);
export default TicketRow;
