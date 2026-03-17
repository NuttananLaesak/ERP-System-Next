"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { getAttendanceHistory } from "@/services/user/attendance.service";

import { CalendarDays } from "lucide-react";
import { Attendance } from "@/types/attendance";

export default function AttendancePage() {
  const [history, setHistory] = useState<Attendance[]>([]);

  const now = new Date();

  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    getAttendanceHistory().then(setHistory);
  }, []);

  const getDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();

    const diff = end - start;

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const filteredHistory = history.filter((item) => {
    const d = new Date(item.date);

    return d.getMonth() === month && d.getFullYear() === year;
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - i);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-8 h-8 text-muted-foreground" />
            <h1 className="text-2xl font-bold">Attendance History</h1>
          </div>

          {/* Month Year Picker */}
          <div className="flex gap-3">
            {/* Month */}
            <Select
              value={month.toString()}
              onValueChange={(v) => setMonth(Number(v))}
            >
              <SelectTrigger className="w-37.5">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year */}
            <Select
              value={year.toString()}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="w-30">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Card */}
        <Card className="shadow-sm border">
          <CardContent>
            {/* Table */}
            <div className="overflow-x-auto -mt-4">
              <table className="min-w-162.5 w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Check In</th>
                    <th className="text-left py-3 px-4">Check Out</th>
                    <th className="text-left py-3 px-4">Duration</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-muted/40 transition"
                    >
                      <td className="py-3 px-4 font-medium">
                        {new Date(item.date).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 text-green-600">
                        {item.checkIn
                          ? new Date(item.checkIn).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>

                      <td className="py-3 px-4 text-blue-600">
                        {item.checkOut
                          ? new Date(item.checkOut).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>

                      <td className="py-3 px-4">
                        {item.checkIn && item.checkOut
                          ? getDuration(item.checkIn, item.checkOut)
                          : "-"}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded
                          ${
                            item.checkIn && item.checkOut
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.checkIn && item.checkOut
                            ? "Completed"
                            : "Missing checkout"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No attendance found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
