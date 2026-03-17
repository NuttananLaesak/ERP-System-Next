import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/auth-guard";

// ฟังก์ชันคำนวณวันทำงานในเดือน
function getWorkingDaysInMonth(year: number, month: number) {
  let count = 0;
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    const day = date.getDay();

    // 0 = Sunday, 6 = Saturday (วันเสาร์-อาทิตย์ไม่เป็นวันทำงาน)
    if (day !== 0 && day !== 6) {
      count++;
    }

    date.setDate(date.getDate() + 1);
  }

  return count;
}

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

export const GET = authGuard(async (user) => {
  const policy = await prisma.workPolicy.findUnique({
    where: { userId: user.id },
  });

  if (!policy) {
    return NextResponse.json([]); // ถ้าไม่มี work policy ให้คืนค่าเป็น array ว่าง
  }

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;

  const attendances = await prisma.attendance.findMany({
    where: { userId: user.id },
  });

  const months = new Set<string>();

  for (const a of attendances) {
    const d = new Date(a.date);
    const m = `${d.getFullYear()}-${d.getMonth() + 1}`;
    months.add(m);
  }

  const results: Payroll[] = [];

  for (const month of months) {
    const [year, m] = month.split("-").map(Number);

    const start = new Date(year, m - 1, 1);
    const end = new Date(year, m, 0);

    const records = await prisma.attendance.findMany({
      where: {
        userId: user.id,
        date: {
          gte: start,
          lte: end,
        },
      },
    });

    let workedHours = 0;
    let workedDays = 0;

    for (const r of records) {
      if (r.checkIn && r.checkOut) {
        const diff =
          new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime();

        workedHours += diff / (1000 * 60 * 60); // คำนวณชั่วโมงที่ทำงาน
        workedDays += 1; // นับวันทำงาน
      }
    }

    // คำนวณจำนวนวันทำงานจริงในเดือนนี้
    const workingDays = getWorkingDaysInMonth(year, m - 1);

    // คำนวณชั่วโมงที่ทำงานในเดือนนี้
    const hoursPerMonth = workingDays * policy.workHoursPerDay;

    // คำนวณอัตราค่าจ้างต่อชั่วโมง
    const hourRate = policy.monthlySalary / hoursPerMonth;

    // คำนวณเงินเดือน
    const salary = workedHours * hourRate;

    if (month === currentMonth) {
      // เดือนปัจจุบันคำนวณแบบ realtime
      results.push({
        id: `realtime-${month}`,
        month,
        baseSalary: policy.monthlySalary,
        hoursWorkPerDay: policy.workHoursPerDay,
        daysWorkPerWeek: policy.workDaysPerWeek,
        workedHours,
        workedDays,
        netSalary: salary,
      });
    } else {
      // สำหรับเดือนเก่า check ว่ามี payroll หรือไม่ ถ้าไม่มีให้บันทึก
      const exists = await prisma.payroll.findFirst({
        where: {
          userId: user.id,
          month,
        },
      });

      if (!exists) {
        const payroll = await prisma.payroll.create({
          data: {
            userId: user.id,
            month,
            baseSalary: policy.monthlySalary,
            hoursWorkPerDay: policy.workHoursPerDay,
            daysWorkPerWeek: policy.workDaysPerWeek,
            workedHours,
            workedDays,
            salary,
            bonus: 0,
            tax: 0,
            netSalary: salary,
          },
        });

        results.push(payroll);
      } else {
        results.push(exists);
      }
    }
  }

  // จัดเรียง payroll โดยเรียงเดือนล่าสุดไปเก่าที่สุด
  results.sort((a, b) => b.month.localeCompare(a.month));

  return NextResponse.json(results);
});
