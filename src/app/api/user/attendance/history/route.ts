import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authGuard } from "@/lib/auth-guard";

export const GET = authGuard(async (user) => {
  const history = await prisma.attendance.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return NextResponse.json(history);
});
