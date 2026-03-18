import { authGuard } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = authGuard<{ id: string }>(
  async (_user, req, { params }) => {
    const id = Number(params.id);
    const body = await req.json();

    const task = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(task);
  },
);

export const DELETE = authGuard<{ id: string }>(
  async (_user, _req, { params }) => {
    const id = Number(params.id);

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ success: true });
  },
);
