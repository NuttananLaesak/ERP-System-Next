import { apiFetch } from "@/lib/api";

export const checkIn = () => {
  return apiFetch("/api/user/attendance/checkin", {
    method: "POST",
  });
};

export const checkOut = () => {
  return apiFetch("/api/user/attendance/checkout", {
    method: "POST",
  });
};

export const getAttendanceHistory = async () => {
  const response = await apiFetch("/api/user/attendance/history");
  return response;
};
