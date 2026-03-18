"use client";

import { useEffect, useState } from "react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { registerSchema, RegisterInput } from "@/schemas/auth.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { User, Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";

import { toast } from "sonner";
import Link from "next/link";
import { register } from "@/services/auth.service";
import { getPosition } from "@/services/position.service";
import { Position } from "@/types/position";
import { handleFormValidateErrors } from "@/utils/handleFormValidateErrors";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    getPosition()
      .then(setPositions)
      .catch(() => toast.error("Failed to load positions"));
  }, []);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const validateError = (errors: FieldErrors<RegisterInput>) => {
    handleFormValidateErrors(errors, [
      "name",
      "email",
      "password",
      "positionId",
    ]);
  };

  const onSubmit = async (data: RegisterInput) => {
    const promise = register(data);

    toast.promise(promise, {
      loading: "Creating account...",
      success: () => {
        router.push("/login");
        return "Account created";
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background to-muted px-4">
      <Card
        className="w-full max-w-sm  animate-in fade-in zoom-in-95 slide-in-from-bottom-6
        duration-500
        hover:shadow-xl
        transition
        "
      >
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Register
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit, validateError)}
            className="space-y-4"
          >
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Name"
                className="pl-10"
                {...form.register("name")}
              />
            </div>

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
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Controller
                control={form.control}
                name="positionId"
                render={({ field }) => (
                  <Select
                    value={field.value?.toString() || ""}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="w-full pl-10 text-foreground">
                      <SelectValue placeholder="Select Position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((pos) => (
                        <SelectItem key={pos.id} value={pos.id.toString()}>
                          {pos.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <Button type="submit" className="w-full active:scale-95">
              Register
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Already have an account?
          <Link href="/login" className="ml-1 text-primary hover:underline">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
