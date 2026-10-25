import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquareText,
  PlusCircle,
  Settings2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "./Brand.jsx";

const authorLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/books", label: "My books", icon: BookOpen },
  { to: "/tickets", label: "My tickets", icon: MessageSquareText },
  { to: "/new-ticket", label: "Contact support", icon: PlusCircle },
];
const adminLinks = [
  { to: "/admin", label: "Ticket queue", icon: LifeBuoy },
  { to: "/admin/tickets", label: "All tickets", icon: MessageSquareText },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = user?.role === "admin" ? adminLinks : authorLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fffaf8] lg:flex">
      <aside className="border-b border-rose-100 bg-white px-5 py-5 lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <Brand />
        <div className="mt-8 hidden rounded-2xl bg-cream p-4 lg:block">
          <p className="eyebrow">Your workspace</p>
          <p className="mt-2 text-sm font-semibold">
            {user?.role === "admin" ? "Operations desk" : "Author studio"}
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            {user?.role === "admin"
              ? "Every query, one clear next step."
              : "Your books and support, in one place."}
          </p>
        </div>
        <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? "bg-roseleaf text-ink" : "text-muted hover:bg-cream hover:text-ink"}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden border-t border-rose-100 pt-5 lg:block">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-sm font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name}</p>
              <p className="truncate text-xs text-muted">
                {user?.role === "admin" ? "Administrator" : "Author account"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted hover:bg-cream hover:text-ink"
          >
            <LogOut size={17} /> Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 lg:ml-64">
        <header className="flex items-center justify-between border-b border-rose-100 bg-white/80 px-5 py-4 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-medium text-muted">
              {user?.role === "admin"
                ? "BOOKLEAF / OPERATIONS"
                : "BOOKLEAF / AUTHOR PORTAL"}
            </p>
            <p className="mt-1 text-sm font-bold">
              {user?.role === "admin"
                ? "Support workspace"
                : `Welcome back, ${user?.name?.split(" ")[0]}`}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-cream px-3 py-2 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Workspace
            active
          </div>
        </header>
        <div className="p-5 sm:p-8">
          <Outlet />
        </div>
        <div className="px-5 pb-6 text-center text-xs text-muted sm:px-8">
          BookLeaf Author Care · Built for clearer conversations
        </div>
      </main>
      <button
        onClick={handleLogout}
        className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full border border-rose-100 bg-white px-4 py-3 text-xs font-semibold shadow-soft lg:hidden"
      >
        <LogOut size={15} /> Sign out
      </button>
    </div>
  );
};
export default AppLayout;
