"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Dashboard 🎉</h1>

      <button
        onClick={logout}
        className="px-4 py-2 text-white bg-red-500 rounded"
      >
        Logout
      </button>
    </div>
  );
}
