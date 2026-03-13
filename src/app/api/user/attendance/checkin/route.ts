import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await prisma.attendance.findFirst({
    where: {
      userId: user.id,
      date: today,
    },
  });

  if (existing?.checkIn) {
    return NextResponse.json(
      { message: "Already checked in" },
      { status: 400 },
    );
  }

  if (existing) {
    const attendance = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkIn: new Date(),
      },
    });

    return NextResponse.json(attendance);
  }

  const attendance = await prisma.attendance.create({
    data: {
      userId: user.id,
      checkIn: new Date(),
      date: today,
    },
  });

  return NextResponse.json(attendance);
}
