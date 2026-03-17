"use client";

import { useEffect, useState } from "react";
import { getPayrolls } from "@/services/user/payroll.service";
import { Calendar, DollarSign, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Payroll } from "@/types/payroll";

const formatMonth = (month: string) => {
  const [year, m] = month.split("-").map(Number);

  return new Date(year, m - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function PayrollPage() {
  const [data, setData] = useState<Payroll[]>([]);

  useEffect(() => {
    getPayrolls().then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Payroll History
          </h1>
          <p className="text-muted-foreground text-sm">
            Your monthly salary summary
          </p>
        </div>

        {/* LIST */}
        <div className="grid gap-4 sm:gap-5">
          {data.map((p) => (
            <Card
              key={p.id}
              className="hover:shadow-lg transition-all duration-200"
            >
              {/* HEADER */}
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
                {/* LEFT */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Calendar className="text-muted-foreground" size={18} />

                  <CardTitle className="text-base sm:text-lg">
                    {formatMonth(p.month)}
                  </CardTitle>

                  {typeof p.id === "string" && (
                    <Badge variant="secondary">Current</Badge>
                  )}
                </div>

                {/* SALARY */}
                <div className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-1">
                  <DollarSign size={18} />
                  {formatMoney(p.netSalary)}
                </div>
              </CardHeader>

              {/* CONTENT */}
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-0">
                {/* WORK INFO */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {p.workedHours.toFixed(0)} hours
                  </div>

                  <div>{p.workedDays} days worked</div>
                </div>

                {/* SETTINGS */}
                {p.baseSalary && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">
                      <DollarSign size={12} />
                      Base {formatMoney(p.baseSalary)}
                    </Badge>

                    <Badge variant="outline">
                      <Clock size={12} />
                      {p.hoursWorkPerDay}h / day
                    </Badge>

                    <Badge variant="outline">{p.daysWorkPerWeek}d / week</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {/* EMPTY */}
          {data.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                No payroll records
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
