import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export function authGuard(handler: (user: AuthUser) => Promise<Response>) {
  return async () => {
    const user = await getUser();

    if (!user) {
      const data = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      data.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      });

      return data;
    }

    return handler(user);
  };
}
