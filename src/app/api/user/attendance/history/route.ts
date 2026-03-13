import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const history = await prisma.attendance.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return NextResponse.json(history);
}
