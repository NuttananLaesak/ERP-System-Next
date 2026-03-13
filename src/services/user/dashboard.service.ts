import { apiFetch } from "@/lib/api";

export type DashboardData = {
  tasks: number;
  attendance: {
    checkIn: string | null;
    checkOut: string | null;
  } | null;
  leave: {
    status: "PENDING" | "APPROVED" | "REJECTED";
  } | null;
  payroll: {
    netSalary: number;
  } | null;
};

export const getDashboard = (): Promise<DashboardData> => {
  return apiFetch("/api/user/dashboard");
};
