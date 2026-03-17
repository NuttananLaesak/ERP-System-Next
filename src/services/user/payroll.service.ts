import { apiFetch } from "@/lib/api";
import { Payroll } from "@/types/payroll";

export const getPayrolls = (): Promise<Payroll[]> => {
  return apiFetch("/api/user/payroll");
};
