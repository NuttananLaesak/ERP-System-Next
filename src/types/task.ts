export type Task = {
  id: number;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  createdAt: string;
};
