import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import api, { DEMO_MODE } from "./lib/api";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

// Pages
import { Home } from "./pages/Home";
import { LearnMore } from "./pages/LearnMore";
import { Pricing } from "./pages/Pricing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { OrderDetail } from "./pages/OrderDetail";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminFeatures } from "./pages/admin/Features";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { Terms } from "./pages/Terms";
import { RefundPolicy } from "./pages/RefundPolicy";

export function App() {
  const auth = useAuth();
  const [apiDown, setApiDown] = useState(false);

  useEffect(() => {
    if (DEMO_MODE) {
      setApiDown(false);
      return;
    }
    api.get("/flags").then(() => setApiDown(false)).catch(() => setApiDown(true));
  }, []);

  useEffect(() => {
    if (!auth.user) return;

    if (DEMO_MODE) {
      const handler = (event: Event) => {
        const detail = (event as CustomEvent<{ orderId: string; stage: string }>).detail;
        if (detail) alert(`Realtime update for ${detail.orderId}: ${detail.stage}`);
      };
      window.addEventListener("demo:order-updated", handler);
      return () => window.removeEventListener("demo:order-updated", handler);
    }

    const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:4000", { withCredentials: true });
    socket.emit("join:user", auth.user.id);
    socket.on("order:updated", ({ orderId, stage }) => {
      alert(`Realtime update for ${orderId}: ${stage}`);
    });
    return () => { socket.disconnect(); };
  }, [auth.user]);

  const handleAuth = async () => {
    const me = await api.get('/auth/me');
    auth.setUser(me.data);
  };

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading session...</p>
      </div>
    );
  }

  return (
    <>
      {DEMO_MODE && (
        <div className="bg-green-100 border-b border-green-200 text-green-800 px-4 py-2 text-center text-sm font-medium">
          ✨ Demo Mode: Running fully static from GitHub Pages (no backend required)
        </div>
      )}
      {apiDown && (
        <div className="bg-red-100 border-b border-red-200 text-red-800 px-4 py-2 text-center text-sm font-medium">
          ⚠️ API unreachable: showing limited experience
        </div>
      )}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/learn-more" element={<LearnMore />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login onAuth={handleAuth} />} />
          <Route path="/register" element={<Register onAuth={handleAuth} />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/dashboard" element={<ProtectedRoute user={auth.user}><Dashboard user={auth.user} /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute user={auth.user}><OrderDetail /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute user={auth.user} adminOnly><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/features" element={<ProtectedRoute user={auth.user} adminOnly><AdminFeatures /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}
