import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const body = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 },
    );
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
