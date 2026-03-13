import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const tasks = await prisma.task.count();

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const attendance = await prisma.attendance.findFirst({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
  });

  const leave = await prisma.leave.findFirst({
    orderBy: { createdAt: "desc" },
  });

  const payroll = await prisma.payroll.findFirst({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    tasks,
    attendance,
    leave,
    payroll,
  });
}
