import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DateFormatOptions = {
  month?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
  day?: "numeric" | "2-digit" | undefined;
  year?: "numeric" | "2-digit" | undefined;
  hour?: "numeric" | "2-digit" | undefined;
  minute?: "numeric" | "2-digit" | undefined;
};

export function formatDate(date: Date | string, options: DateFormatOptions = {}) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const formatOptions = { ...defaultOptions, ...options };
  
  return new Intl.DateTimeFormat("en-US", formatOptions).format(dateObj);
}

export function generateRequestId() {
  return `REQ-${1234 + Math.floor(Math.random() * 1000)}`;
}

export function getAvatarColor(index: number) {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-amber-100 text-amber-800',
    'bg-teal-100 text-teal-800'
  ];
  return colors[index % colors.length];
}
