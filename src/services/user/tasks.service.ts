import { apiFetch } from "@/lib/api";

export type Task = {
  id: number;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
};

export const getTasks = (): Promise<Task[]> => {
  return apiFetch("/api/user/tasks");
};

export const createTask = (title: string, userId: number) => {
  return apiFetch("/api/user/tasks", {
    method: "POST",
    body: JSON.stringify({ title, userId }),
  });
};

export const updateTask = (id: number, status: Task["status"]) => {
  return apiFetch(`/api/user/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteTask = (id: number) => {
  return apiFetch(`/api/user/tasks/${id}`, {
    method: "DELETE",
  });
};
