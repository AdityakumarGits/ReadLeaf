import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AppLayout from "./components/AppLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BooksPage from "./pages/BooksPage.jsx";
import TicketsPage from "./pages/TicketsPage.jsx";
import NewTicketPage from "./pages/NewTicketPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";

const HomeRedirect = () => {
  const { user } = useAuth();
  return (
    <Navigate
      to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"}
      replace
    />
  );
};

const App = () => (
  <Routes>
    <Route path="/" element={<HomeRedirect />} />
    <Route path="/login" element={<AuthPage mode="login" />} />
    <Route path="/signup" element={<AuthPage mode="signup" />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute role="author" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/new-ticket" element={<NewTicketPage />} />
        </Route>
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/tickets" element={<AdminPage />} />
        </Route>
      </Route>
    </Route>
    <Route path="*" element={<HomeRedirect />} />
  </Routes>
);
export default App;
