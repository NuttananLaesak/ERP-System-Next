import { authGuard } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = authGuard(async (user) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findFirst({
    where: {
      userId: user.id,
      date: today,
    },
  });

  if (!attendance?.checkIn) {
    return NextResponse.json({ message: "Check in first" }, { status: 400 });
  }

  if (attendance.checkOut) {
    return NextResponse.json(
      { message: "Already checked out" },
      { status: 400 },
    );
  }

  const updated = await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOut: new Date(),
    },
  });

  return NextResponse.json(updated);
});
