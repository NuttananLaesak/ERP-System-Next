"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { loginSchema, LoginInput } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    const promise = fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      return result;
    });

    toast.promise(promise, {
      loading: "Logging in...",
      success: () => {
        router.push("/dashboard");
        return "Login successful";
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background to-muted px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                className="pl-10"
                {...form.register("email")}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10"
                {...form.register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Don’t have an account?
          <a href="/register" className="ml-1 text-primary hover:underline">
            Register
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
