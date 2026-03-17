import { authGuard } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = authGuard(async () => {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
});

export async function POST(req: Request) {
  const body = await req.json();

  const task = await prisma.task.create({
    data: {
      title: body.title,
      userId: body.userId,
    },
  });

  return NextResponse.json(task);
}
