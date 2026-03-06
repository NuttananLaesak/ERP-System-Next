import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(body.password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const response = NextResponse.json({
    message: "Login success",
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return response;
}
