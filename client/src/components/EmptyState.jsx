import { Inbox } from "lucide-react";
const EmptyState = ({ title, text, action }) => (
  <div className="px-5 py-14 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream">
      <Inbox size={24} />
    </div>
    <h3 className="mt-4 font-bold">{title}</h3>
    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">{text}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
export default EmptyState;
