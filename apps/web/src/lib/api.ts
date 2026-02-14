import axios from "axios";

type Role = "ADMIN" | "CUSTOMER";
type User = { id: string; email: string; role: Role; name: string; password: string };
type Order = { id: string; userId: string; stage: string; notes?: string; pickupAt: string; createdAt: string; qrDataUrl: string };
type Flag = { key: string; enabled: boolean; description: string };

type DemoDb = {
  users: User[];
  orders: Order[];
  flags: Flag[];
  currentUserId: string | null;
};

const QR_PLACEHOLDER =
  "data:image/svg+xml;base64," +
  btoa('<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="white"/><rect x="20" y="20" width="140" height="140" fill="black"/></svg>');

const defaultDb: DemoDb = {
  users: [
    { id: "u_admin", email: "admin@ozlaundry.local", role: "ADMIN", name: "Admin", password: "Admin123!" },
    { id: "u_customer", email: "user@ozlaundry.local", role: "CUSTOMER", name: "Sample Customer", password: "Customer123!" }
  ],
  orders: [
    {
      id: "order_seed_1",
      userId: "u_customer",
      stage: "Scheduled",
      notes: "Sample seeded order",
      pickupAt: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      qrDataUrl: QR_PLACEHOLDER
    }
  ],
  flags: [
    { key: "ironing", enabled: true, description: "Enable ironing" },
    { key: "folding", enabled: true, description: "Enable folding" },
    { key: "detergentSelection", enabled: true, description: "Allow detergent selection" },
    { key: "realtimeTracking", enabled: true, description: "Realtime tracking" },
    { key: "qrScan", enabled: true, description: "QR scan workflow" },
    { key: "subscriptions", enabled: true, description: "Subscriptions" }
  ],
  currentUserId: null
};

const storageKey = "ozlaundry_demo_db";
export const DEMO_MODE = !import.meta.env.VITE_API_BASE_URL;

function loadDb(): DemoDb {
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    localStorage.setItem(storageKey, JSON.stringify(defaultDb));
    return structuredClone(defaultDb);
  }
  return JSON.parse(raw) as DemoDb;
}

function saveDb(db: DemoDb) {
  localStorage.setItem(storageKey, JSON.stringify(db));
}

function currentUser(db: DemoDb) {
  return db.users.find((u) => u.id === db.currentUserId) || null;
}

let fallbackToken: string | null = localStorage.getItem("token");

const http = axios.create({
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"}/api`,
  withCredentials: true
});

http.interceptors.request.use((config) => {
let fallbackToken: string | null = localStorage.getItem("token");

api.interceptors.request.use((config) => {
  if (fallbackToken) config.headers.Authorization = `Bearer ${fallbackToken}`;
  return config;
});

async function demoGet(path: string) {
  const db = loadDb();
  const user = currentUser(db);

  if (path === "/auth/me") {
    if (!user) throw new Error("Unauthorized");
    const { password, ...safe } = user;
    return { data: safe };
  }
  if (path === "/flags") return { data: db.flags };
  if (path === "/orders") {
    if (!user) throw new Error("Unauthorized");
    const orders = user.role === "ADMIN" ? db.orders : db.orders.filter((o) => o.userId === user.id);
    return { data: orders };
  }
  if (path.startsWith("/orders/")) {
    if (!user) throw new Error("Unauthorized");
    const id = path.replace("/orders/", "");
    const order = db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Not found");
    if (user.role !== "ADMIN" && order.userId !== user.id) throw new Error("Forbidden");
    return { data: { ...order, qrPayload: `${order.id}.demo-signature` } };
  }
  throw new Error(`Unsupported GET ${path}`);
}

async function demoPost(path: string, body: any) {
  const db = loadDb();

  if (path === "/auth/login") {
    const user = db.users.find((u) => u.email === body.email && u.password === body.password);
    if (!user) throw new Error("Invalid credentials");
    db.currentUserId = user.id;
    saveDb(db);
    const { password, ...safe } = user;
    return { data: { token: `demo-${user.id}`, user: safe } };
  }

  if (path === "/auth/register") {
    const user: User = {
      id: `u_${Date.now()}`,
      name: body.name,
      email: body.email,
      password: body.password,
      role: "CUSTOMER"
    };
    db.users.push(user);
    db.currentUserId = user.id;
    saveDb(db);
    const { password, ...safe } = user;
    return { data: { token: `demo-${user.id}`, user: safe } };
  }

  const user = currentUser(db);
  if (!user) throw new Error("Unauthorized");

  if (path === "/orders") {
    const order: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      stage: "Scheduled",
      notes: body.notes,
      pickupAt: body.pickupAt,
      createdAt: new Date().toISOString(),
      qrDataUrl: QR_PLACEHOLDER
    };
    db.orders.unshift(order);
    saveDb(db);
    return { data: order };
  }

  if (path === "/orders/admin/scan") {
    const orderId = String(body.payload || "").split(".")[0];
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Invalid QR");
    order.stage = body.stage || "Received";
    saveDb(db);
    return { data: order };
  }

  throw new Error(`Unsupported POST ${path}`);
}

async function demoPatch(path: string, body: any) {
  const db = loadDb();
  const user = currentUser(db);
  if (!user) throw new Error("Unauthorized");

  if (path.startsWith("/orders/") && path.endsWith("/stage")) {
    const id = path.replace("/orders/", "").replace("/stage", "");
    const order = db.orders.find((o) => o.id === id);
    if (!order) throw new Error("Not found");
    order.stage = body.stage;
    saveDb(db);
    return { data: order };
  }

  if (path.startsWith("/flags/")) {
    const key = path.replace("/flags/", "");
    const flag = db.flags.find((f) => f.key === key);
    if (!flag) throw new Error("Not found");
    flag.enabled = Boolean(body.enabled);
    saveDb(db);
    return { data: flag };
  }

  throw new Error(`Unsupported PATCH ${path}`);
}

const api = DEMO_MODE
  ? { get: demoGet, post: demoPost, patch: demoPatch }
  : { get: http.get.bind(http), post: http.post.bind(http), patch: http.patch.bind(http) };

export function setToken(token: string | null) {
  fallbackToken = token;
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export default api;
