import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { TokenPayload } from "@/types/user";

export async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    return user;
  } catch {
    return null;
  }
}
