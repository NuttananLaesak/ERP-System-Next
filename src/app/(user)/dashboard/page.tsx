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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

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

  return (
    <div className="min-h-screen bg-muted/40">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Attendance */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Card className="hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Attendance
                  </CardTitle>

                  <Clock className="h-5 w-5 text-muted-foreground" />
                </CardHeader>

                <CardContent className="-mt-5">
                  <p
                    className={`text-lg font-semibold ${
                      data.attendance?.checkOut
                        ? "text-blue-600"
                        : data.attendance?.checkIn
                          ? "text-green-600"
                          : "text-red-600"
                    }`}
                  >
                    {!data.attendance?.checkIn
                      ? "Check In"
                      : !data.attendance?.checkOut
                        ? "Check Out"
                        : `Completed (${getDuration(
                            data.attendance.checkIn!,
                            data.attendance.checkOut!,
                          )})`}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Workday status
                  </p>
                </CardContent>
              </Card>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {!data.attendance?.checkIn && (
                <DropdownMenuItem
                  onClick={handleCheckIn}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogIn size={16} className="text-green-600" />
                  Check In
                </DropdownMenuItem>
              )}

              {data.attendance?.checkIn && !data.attendance?.checkOut && (
                <DropdownMenuItem
                  onClick={handleCheckOut}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={16} className="text-orange-600" />
                  Check Out
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link
                  href="/attendance"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <History size={16} className="text-muted-foreground" />
                  View History
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tasks */}
          <Link href="/tasks">
            <Card className="hover:shadow-lg hover:scale-105 transition-transform duration-200">
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
