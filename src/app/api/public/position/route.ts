import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const positions = await prisma.position.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      salary: true,
    },
  });

  return NextResponse.json(positions);
}
