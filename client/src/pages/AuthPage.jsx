import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CircleHelp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Brand from "../components/Brand.jsx";

const AuthPage = ({ mode = "login" }) => {
  const isSignup = mode === "signup";
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = isSignup
        ? await signup(form)
        : await login({ email: form.email, password: form.password });
      const fallback = user.role === "admin" ? "/admin" : "/dashboard";
      navigate(location.state?.from || fallback, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not connect to the server. Check that the backend is running.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf8] lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="soft-grid relative hidden overflow-hidden bg-roseleaf p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <Brand />
        <div className="relative z-10 max-w-xl pb-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-xs font-bold">
            <Sparkles size={15} /> A softer way to get support
          </span>
          <h1 className="mt-7 text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">
            Your words matter.{" "}
            <span className="text-[#9d536c]">We’re listening.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-[#6e4d59]">
            Keep track of your books, royalties, and conversations with the
            people helping your story reach readers.
          </p>
          <div className="mt-9 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
              <BookOpen size={20} />
              <p className="mt-3 font-bold">Your books</p>
              <p className="mt-1 text-xs text-muted">
                Titles, sales and royalties
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4">
              <CircleHelp size={20} />
              <p className="mt-3 font-bold">Human support</p>
              <p className="mt-1 text-xs text-muted">A clear path to answers</p>
            </div>
          </div>
        </div>
        <p className="text-xs font-medium text-[#795d67]">
          BookLeaf Publishing · Author care, thoughtfully done
        </p>
        <div className="absolute -bottom-20 -right-10 h-72 w-72 rounded-full border-[40px] border-white/20" />
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-10 lg:hidden">
            <Brand />
          </div>
          <p className="eyebrow">
            {isSignup ? "Start your author journey" : "Welcome back"}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
            {isSignup ? "Create your account" : "Sign in to BookLeaf"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {isSignup
              ? "Join your books and support conversations in one calm space."
              : "Your books, royalties and support tickets are right where you left them."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full name
                </label>
                <input
                  className="field"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  autoComplete="name"
                  required
                />
              </div>
            )}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email address
              </label>
              <input
                className="field"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <input
                className="field"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  isSignup ? "At least 8 characters" : "Enter your password"
                }
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={isSignup ? 8 : 1}
                required
              />
            </div>
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}
            <button className="btn-primary w-full py-3.5" disabled={busy}>
              {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? "Already have an account?" : "New to BookLeaf?"}{" "}
            <Link
              className="font-bold text-ink underline decoration-roseleaf decoration-2 underline-offset-4"
              to={isSignup ? "/login" : "/signup"}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </Link>
          </p>
          {!isSignup && (
            <div className="mt-8 rounded-2xl border border-rose-100 bg-white p-4">
              <p className="flex items-center gap-2 text-xs font-bold">
                <ShieldCheck size={15} /> Demo access
              </p>
              <p className="mt-2 text-xs leading-5 text-muted">
                Author: priya.sharma@email.com / Author@123
              </p>
              <p className="text-xs leading-5 text-muted">
                Admin: admin@bookleaf.com / Admin@123
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
export default AuthPage;
