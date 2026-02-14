import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <h1>OzLaundry MVP</h1>
      <nav style={{ display: "flex", gap: 8 }}>
        <Link to="/">Home</Link>
        <Link to="/learn-more">Learn more</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/admin/orders">Admin Orders</Link>
        <Link to="/admin/features">Admin Features</Link>
      </nav>
      <Outlet />
    </div>
  );
}
