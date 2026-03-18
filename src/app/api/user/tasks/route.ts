import { authGuard } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = authGuard(async () => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
});

export const POST = authGuard(async (user, req) => {
  const body = await req.json();

  const task = await prisma.task.create({
    data: {
      title: body.title,
      userId: user.id,
    },
  });

  return NextResponse.json(task);
});
