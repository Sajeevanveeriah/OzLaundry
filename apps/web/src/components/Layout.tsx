import { Outlet } from "react-router-dom";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Outlet />
    </div>
  );
}
