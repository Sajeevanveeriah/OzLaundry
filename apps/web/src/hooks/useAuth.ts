import { useEffect, useState } from "react";
import api, { setToken } from "../lib/api";

export type User = { id: string; email: string; role: "ADMIN" | "CUSTOMER"; name: string };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me").then((r) => setUser(r.data)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  return {
    user,
    loading,
    setUser,
    setToken,
  };
}
