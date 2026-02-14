import { useEffect, useState } from "react";
import { Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api, { DEMO_MODE, setToken } from "./lib/api";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

function Home() {
  const nav = useNavigate();
  return <div><p>Subscription laundry with realtime tracking.</p><button onClick={() => nav("/learn-more")}>Learn more</button> <button onClick={() => nav("/login")}>Get started</button></div>;
}
const LearnMore = () => <p>We pick up, wash, dry, iron, fold and deliver.</p>;
const Pricing = () => <p>Starter $19.99, Family $49.99 (demo pricing).</p>;

function Login({ onAuth }: { onAuth: () => void }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("user@ozlaundry.local");
  const [password, setPassword] = useState("Customer123!");
  return <form onSubmit={async e => { e.preventDefault(); const r = await api.post("/auth/login", { email, password }); setToken(r.data.token); onAuth(); nav("/dashboard"); }}>
    <h2>Login</h2><input value={email} onChange={e => setEmail(e.target.value)} /><input value={password} onChange={e => setPassword(e.target.value)} type="password" />
    <button type="submit">Login</button> <Link to="/register">Register</Link>
  </form>;
}

function Register({ onAuth }: { onAuth: () => void }) {
  const nav = useNavigate();
  const [name, setName] = useState("Demo User");
  const [email, setEmail] = useState(`user${Math.floor(Math.random()*1000)}@demo.local`);
  const [password, setPassword] = useState("Customer123!");
  return <form onSubmit={async e => { e.preventDefault(); const r = await api.post("/auth/register", { name, email, password }); setToken(r.data.token); onAuth(); nav("/dashboard"); }}>
    <h2>Register</h2><input value={name} onChange={e => setName(e.target.value)} /><input value={email} onChange={e => setEmail(e.target.value)} /><input value={password} onChange={e => setPassword(e.target.value)} type="password" />
    <button type="submit">Register</button>
  </form>;
}

function Dashboard({ user }: { user: any }) {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => { api.get("/orders").then(r => setOrders(r.data)); }, []);
  return <div><h2>Dashboard ({user?.email})</h2><button onClick={async ()=>{await api.post("/orders", { pickupAt: new Date().toISOString(), notes: "quick order"}); const r= await api.get("/orders"); setOrders(r.data);}}>Create Order</button>
    <ul>{orders.map(o => <li key={o.id}><Link to={`/orders/${o.id}`}>{o.id} - {o.stage}</Link></li>)}</ul>
  </div>;
}

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>();
  useEffect(() => { api.get(`/orders/${id}`).then(r => setOrder(r.data)); }, [id]);
  if (!order) return <p>Loading...</p>;
  return <div><h3>Order {order.id}</h3><p>Stage: {order.stage}</p><img src={order.qrDataUrl} width={200} /></div>;
}

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [scanPayload, setScanPayload] = useState("");
  useEffect(() => { api.get("/orders").then(r => setOrders(r.data)); }, []);
  return <div><h2>Admin Orders</h2>
    <ul>{orders.map(o => <li key={o.id}>{o.id} - {o.stage} <button onClick={async ()=>{await api.patch(`/orders/${o.id}/stage`, { stage: "Washing", actor: "admin" }); const r=await api.get("/orders"); setOrders(r.data);}}>Set Washing</button></li>)}</ul>
    <h3>/admin/scan</h3>
    <input value={scanPayload} onChange={e => setScanPayload(e.target.value)} placeholder="orderId.signature" />
    <button onClick={async ()=>{await api.post("/orders/admin/scan", { payload: scanPayload, stage: "Received" });}}>Scan & Update</button>
  </div>;
}

function AdminFeatures() {
  const [flags, setFlags] = useState<any[]>([]);
  useEffect(() => { api.get("/flags").then(r => setFlags(r.data)); }, []);
  return <div><h2>Admin Features</h2>
    {flags.map(f => <div key={f.key}><label><input type="checkbox" checked={f.enabled} onChange={async e => { const r = await api.patch(`/flags/${f.key}`, { enabled: e.target.checked }); setFlags(flags.map(x => x.key === f.key ? r.data : x)); }} />{f.key}</label></div>)}
  </div>;
}

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

  if (auth.loading) return <p>Loading session...</p>;

  return <>
    {DEMO_MODE && <div style={{ background: "#e8f5e9", padding: 8 }}>Demo Mode: running fully static from GitHub Pages (no backend required).</div>}
    {apiDown && <div style={{background:"#fdd",padding:8}}>API unreachable: showing limited experience.</div>}
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login onAuth={async ()=>{ const me = await api.get('/auth/me'); auth.setUser(me.data);} } />} />
        <Route path="/register" element={<Register onAuth={async ()=>{ const me = await api.get('/auth/me'); auth.setUser(me.data);} } />} />
        <Route path="/dashboard" element={<ProtectedRoute user={auth.user}><Dashboard user={auth.user} /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute user={auth.user}><OrderDetail /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute user={auth.user} adminOnly><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/features" element={<ProtectedRoute user={auth.user} adminOnly><AdminFeatures /></ProtectedRoute>} />
      </Route>
    </Routes>
  </>;
}
