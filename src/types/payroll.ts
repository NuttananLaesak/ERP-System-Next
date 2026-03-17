export type Payroll = {
  id: number | string;
  month: string;
  baseSalary?: number;
  hoursWorkPerDay?: number;
  daysWorkPerWeek?: number;
  workedHours: number;
  workedDays: number;
  netSalary: number;
};
