"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <>
      <nav className="border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="font-bold text-2xl">MyApp</div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              href="/users"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Users size={16} />
              Users
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Settings size={16} />
              Settings
            </Link>

            <Button
              variant="destructive"
              size="sm"
              onClick={logout}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Slide Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-background border-l shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Menu</h2>

          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6 text-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-primary"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/users"
            className="flex items-center gap-2 hover:text-primary"
          >
            <Users size={18} />
            Users
          </Link>

          <Link
            href="/settings"
            className="flex items-center gap-2 hover:text-primary"
          >
            <Settings size={18} />
            Settings
          </Link>

          <Button
            variant="destructive"
            className="mt-4 flex items-center gap-2"
            onClick={logout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
