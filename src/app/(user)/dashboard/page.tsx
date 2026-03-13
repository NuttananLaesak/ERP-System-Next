"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/app/(user)/components/layout/navbar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  ClipboardList,
  Clock,
  CalendarDays,
  Wallet,
  History,
  LogOut,
  LogIn,
} from "lucide-react";

import { DashboardData, getDashboard } from "@/services/user/dashboard.service";
import { toast } from "sonner";
import { checkIn, checkOut } from "@/services/user/attendance.service";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getDashboard().then(setData);
  }, []);

  const handleCheckIn = async () => {
    try {
      await checkIn();
      toast.success("Checked in successfully");

      const newData = await getDashboard();
      setData(newData);
    } catch {
      toast.error("Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    try {
      await checkOut();
      toast.success("Checked out successfully");

      const newData = await getDashboard();
      setData(newData);
    } catch {
      toast.error("Check-out failed");
    }
  };

  const getDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-muted/40">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const status = !data.attendance?.checkIn
    ? "Not checked in"
    : !data.attendance?.checkOut
      ? "Working"
      : "Completed";

  const statusConfig = {
    "Not checked in": {
      dot: "bg-red-600",
      text: "text-red-500",
    },
    Working: {
      dot: "bg-green-600",
      text: "text-green-500",
    },
    Completed: {
      dot: "bg-blue-600",
      text: "text-blue-500",
    },
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Attendance */}
        <Card className="border shadow-sm ">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-muted-foreground" />
              Attendance
            </CardTitle>

            <Link
              href="/attendance"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
            >
              <History size={16} />
              History
            </Link>
          </CardHeader>

          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            {/* Time */}
            <div className="space-y-2">
              <p className="text-5xl font-bold tracking-tight">{time}</p>

              <div className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`}
                />

                <p
                  className={`text-lg font-medium ${statusConfig[status].text}`}
                >
                  {status}

                  {status === "Completed" &&
                    ` (${getDuration(
                      data.attendance!.checkIn!,
                      data.attendance!.checkOut!,
                    )})`}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                Manage your workday attendance
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              {!data.attendance?.checkIn && (
                <button
                  onClick={handleCheckIn}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow-sm"
                >
                  <LogIn size={16} />
                  Check In
                </button>
              )}

              {data.attendance?.checkIn && !data.attendance?.checkOut && (
                <button
                  onClick={handleCheckOut}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition shadow-sm"
                >
                  <LogOut size={16} />
                  Check Out
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Other Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Tasks */}
          <Link href="/tasks">
            <Card className="hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Tasks</CardTitle>

                <ClipboardList className="h-5 w-5 text-muted-foreground" />
              </CardHeader>

              <CardContent className="-mt-5">
                <p className="text-2xl font-bold">{data.tasks}</p>

                <p className="text-xs text-muted-foreground">Tasks assigned</p>
              </CardContent>
            </Card>
          </Link>

          {/* Leave */}
          <Card className="hover:shadow-lg hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Leave Status
              </CardTitle>

              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent className="-mt-5">
              <p className="text-lg font-semibold text-green-600">
                {data.leave?.status ?? "No Pending Leave"}
              </p>

              <p className="text-xs text-muted-foreground">
                Leave request status
              </p>
            </CardContent>
          </Card>

          {/* Payroll */}
          <Card className="hover:shadow-lg hover:scale-105 transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payroll</CardTitle>

              <Wallet className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent className="-mt-5">
              <p className="text-lg font-semibold text-blue-600">
                {data.payroll ? "Latest Salary" : "No Payroll"}
              </p>

              <p className="text-xs text-muted-foreground">
                {data.payroll
                  ? `Net: $${data.payroll.netSalary}`
                  : "No salary record"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
