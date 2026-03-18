"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

import { getDashboard } from "@/services/user/dashboard.service";
import { toast } from "sonner";
import { checkIn, checkOut } from "@/services/user/attendance.service";
import { Dashboard } from "@/types/dashboard";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
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
    return <DashboardSkeleton />;
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
      border: "border-l-red-500",
    },
    Working: {
      dot: "bg-green-600",
      text: "text-green-500",
      border: "border-l-green-500",
    },
    Completed: {
      dot: "bg-blue-600",
      text: "text-blue-500",
      border: "border-l-blue-500",
    },
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Attendance */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card
            className={`border-l-4 ${statusConfig[status].border} transition-all duration-200`}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <Clock className="h-6 w-6 text-black" />
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
              <div className="space-y-2 -mt-4">
                <p className="text-4xl sm:text-5xl font-bold tracking-tight">
                  {time}
                </p>

                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${statusConfig[status].dot}`}
                  />

                  <p
                    className={`text-base font-medium ${statusConfig[status].text}`}
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
              <div className="flex gap-3 -mt-5">
                {!data.attendance?.checkIn && (
                  <button
                    onClick={handleCheckIn}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-600 text-white  hover:scale-105 transition-transform duration-200 shadow-sm cursor-pointer"
                  >
                    <LogIn size={16} />
                    Check In
                  </button>
                )}

                {data.attendance?.checkIn && !data.attendance?.checkOut && (
                  <button
                    onClick={handleCheckOut}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white hover:scale-105 transition-transform duration-200 shadow-sm cursor-pointer"
                  >
                    <LogOut size={16} />
                    Check Out
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Other Cards */}
        <motion.div
          className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 },
            },
          }}
        >
          {/* Tasks */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Link href="/tasks">
              <Card className="border-l-4 border-l-purple-500 hover:shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tasks</CardTitle>

                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </CardHeader>

                <CardContent className="-mt-5">
                  <p className="text-2xl font-bold">{data.tasks}</p>

                  <p className="text-xs text-muted-foreground">
                    Tasks assigned
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>

          {/* Leave */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Card className="border-l-4 border-l-green-500 hover:shadow-lg hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Leave Status
                </CardTitle>

                <CalendarDays className="h-6 w-6 text-green-600" />
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
          </motion.div>

          {/* Payroll */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <Link href="/payroll">
              <Card className="border-l-4 border-l-blue-500  hover:shadow-lg hover:scale-105 transition-transform duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Payroll</CardTitle>

                  <Wallet className="h-6 w-6 text-blue-600" />
                </CardHeader>

                <CardContent className="-mt-5">
                  <p className="text-lg font-semibold text-blue-600">
                    {data.payroll
                      ? `$${data.payroll.estimatedSalary.toFixed(2)} (${data.payroll.workedHours.toFixed(0)} hours)`
                      : "No Payroll"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {data.payroll
                      ? `Base salary: $${data.payroll.baseSalary}`
                      : "No salary policy"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
