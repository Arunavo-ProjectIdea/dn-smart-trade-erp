import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatClientId(id: string) {
  if (!id || !id.includes('-') || id.length < 20) return id;
  const num = parseInt(id.split('-')[0], 16) % 10000;
  return `CI-${num.toString().padStart(3, '0')}`;
}
