import { apiFetch } from "@/lib/api";
import { RegisterInput, LoginInput } from "@/schemas/auth.schema";

export function register(data: RegisterInput) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function login(data: LoginInput) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function logout() {
  return apiFetch("/api/auth/logout", {
    method: "POST",
  });
}
