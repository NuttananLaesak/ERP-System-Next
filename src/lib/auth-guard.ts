import { getUser } from "@/lib/auth";
import { NextResponse } from "next/server";

type AuthUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

export function authGuard<TParams = Record<string, string>>(
  handler: (
    user: AuthUser,
    req: Request,
    context: { params: TParams },
  ) => Promise<Response>,
) {
  return async (
    req: Request,
    context: { params: Promise<TParams> },
  ): Promise<Response> => {
    const user = await getUser();

    if (!user) {
      const res = NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );

      res.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      });

      return res;
    }

    const resolvedParams = await context.params;

    return handler(user, req, { params: resolvedParams });
  };
}
