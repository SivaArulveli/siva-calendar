import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveAsset(path: string | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  
  // Handle absolute paths by prepending the Vite base URL
  const base = import.meta.env.BASE_URL;
  if (path.startsWith('/') && base !== '/') {
    return `${base.replace(/\/$/, '')}${path}`;
  }
  return path;
}
