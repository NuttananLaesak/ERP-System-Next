export type Dashboard = {
  tasks: number;
  attendance: {
    checkIn: string | null;
    checkOut: string | null;
  } | null;
  leave: {
    status: "PENDING" | "APPROVED" | "REJECTED";
  } | null;
  payroll: {
    estimatedSalary: number;
    workedHours: number;
    baseSalary: number;
  } | null;
};
