import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { registerSchema } from "@/schemas/auth.schema";

export async function POST(req: Request) {
  const body = await req.json();
  const data = registerSchema.parse(body);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
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
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, 10),
    },
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email });
}
