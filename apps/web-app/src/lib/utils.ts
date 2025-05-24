import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hasDuplicates(array: unknown[]) {
  return new Set(array).size !== array.length;
}

export function isClerkError(
  error: unknown
): error is Error & { clerkError: boolean; errors: unknown[] } {
  return !!(
    error instanceof Error &&
    "clerkError" in error &&
    error.clerkError &&
    "errors" in error
  );
}
