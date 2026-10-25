const StatusBadge = ({ value }) => {
  const colors = {
    Open: "bg-rose-100 text-rose-700",
    "In Progress": "bg-amber-100 text-amber-800",
    Resolved: "bg-emerald-100 text-emerald-700",
    Closed: "bg-slate-100 text-slate-600",
    Critical: "bg-red-100 text-red-700",
    High: "bg-orange-100 text-orange-700",
    Medium: "bg-amber-100 text-amber-800",
    Low: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${colors[value] || "bg-cream text-ink"}`}
    >
      {value}
    </span>
  );
};
export default StatusBadge;
