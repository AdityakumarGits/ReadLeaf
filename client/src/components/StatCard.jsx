const StatCard = ({ label, value, detail, icon: Icon, tone = "pink" }) => {
  const tones = {
    pink: "bg-blush",
    cream: "bg-cream",
    peach: "bg-peach",
    white: "bg-[#fff7f8]",
  };
  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-3 text-2xl font-extrabold tracking-tight">{value}</p>
          {detail && <p className="mt-2 text-xs text-muted">{detail}</p>}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};
export default StatCard;
