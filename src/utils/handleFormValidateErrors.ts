import { FieldErrors, FieldError } from "react-hook-form";
import { toast } from "sonner";

export function handleFormValidateErrors<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
  fields: (keyof T)[],
) {
  for (const field of fields) {
    const error = errors[field] as FieldError | undefined;

    if (error?.message) {
      const message =
        typeof error.message === "string"
          ? error.message
          : String(error.message);
      toast.error(message);
      break;
    }
  }
}
