"use client";

import { logout } from "@/services/auth.service";

export default function DashboardPage() {
  const handlelogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-center text-3xl font-bold mb-4">
          Welcome to Admin Dashboard
        </h1>
        <p
          onClick={handlelogout}
          className="text-center text-red-500 cursor-pointer"
        >
          logout
        </p>
      </div>
    </div>
  );
}
