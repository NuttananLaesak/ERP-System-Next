import { apiFetch } from "@/lib/api";
import { Dashboard } from "@/types/dashboard";

export const getDashboard = (): Promise<Dashboard> => {
  return apiFetch("/api/user/dashboard");
};
