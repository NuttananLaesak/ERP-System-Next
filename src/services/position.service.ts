import { apiFetch } from "@/lib/api";
import { Position } from "@/types/position";

export const getPosition = (): Promise<Position[]> => {
  return apiFetch("/api/public/position");
};
