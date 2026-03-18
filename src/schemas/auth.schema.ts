import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(10, "Password must be at least 10 characters"),
  positionId: z.preprocess(
    (val) => {
      if (val === undefined || val === null || val === "") return undefined;
      return Number(val);
    },
    z
      .number()
      .optional()
      .refine((val) => val !== undefined, {
        message: "Position is required",
      }),
  ),
  // positionId: z.refine((val) => val !== undefined, {
  //   message: "Position is required",
  // }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
