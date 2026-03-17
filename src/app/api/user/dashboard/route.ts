import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/auth-guard";

function getWorkingDaysInMonth(year: number, month: number) {
  let count = 0;
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    const day = date.getDay();

    // 0 = Sunday
    // 6 = Saturday
    if (day !== 0 && day !== 6) {
      count++;
    }

    date.setDate(date.getDate() + 1);
  }

  return count;
}

export const GET = authGuard(async (user) => {
  const tasks = await prisma.task.count({
    where: {
      userId: user.id,
    },
  });

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const attendance = await prisma.attendance.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  const leave = await prisma.leave.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: { createdAt: "desc" },
  });

  const policy = await prisma.workPolicy.findUnique({
    where: {
      userId: user.id,
    },
  });

  let estimatedSalary = 0;
  let workedHours = 0;
  let workedDays = 0;

  if (policy) {
    const now = new Date();

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const attendances = await prisma.attendance.findMany({
      where: {
        userId: user.id,
        date: {
          gte: monthStart,
        },
      },
    });

    for (const a of attendances) {
      if (a.checkIn && a.checkOut) {
        const diff =
          new Date(a.checkOut).getTime() - new Date(a.checkIn).getTime();

        const hours = diff / (1000 * 60 * 60);

        workedHours += hours;
        workedDays += 1;
      }
    }

    // ⭐ คำนวณวันทำงานจริงของเดือน
    const workingDays = getWorkingDaysInMonth(
      now.getFullYear(),
      now.getMonth(),
    );

    const hoursPerMonth = workingDays * policy.workHoursPerDay;

    const hourRate = policy.monthlySalary / hoursPerMonth;

    estimatedSalary = workedHours * hourRate;
  }

  return NextResponse.json({
    tasks,
    attendance,
    leave,
    payroll: {
      workedHours,
      workedDays,
      estimatedSalary,
      baseSalary: policy?.monthlySalary ?? 0,
    },
  });
});
