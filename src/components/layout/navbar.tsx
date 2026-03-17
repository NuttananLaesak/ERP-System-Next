"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, LogOut, Menu, Box, X } from "lucide-react";
import { logout } from "@/services/auth.service";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: Users,
    },
  ];

  const handlelogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      <nav className="border-b bg-background">
        <div className="flex h-18 items-center justify-between px-6 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary text-primary-foreground shadow">
              <Box className="h-7 w-7" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold tracking-tight">
                ERP System
              </span>
              <span className="text-xs text-muted-foreground">
                Management Platform
              </span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2 text-sm relative">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center px-4 py-2"
                >
                  {active && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-primary rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <span
                    className={`relative z-10 flex items-center gap-1.5 ${
                      active
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} />
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <Button
              variant="destructive"
              size="sm"
              onClick={handlelogout}
              className="flex items-center gap-1.5"
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
        className={`z-9999 fixed top-0 right-0 h-full w-72 bg-background border-l shadow-xl transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl font-semibold">Menu</h2>

          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col gap-2 py-2 px-4">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted active:scale-[0.98]"
                  }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}

          <Button
            variant="destructive"
            className="flex items-center justify-center gap-2"
            onClick={handlelogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
}
