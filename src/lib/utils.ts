import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function darkenHexColor(hex: string, amount: number): string {
  // Usuwamy znak hash (#) z początku hex, jeśli jest
  hex = hex.replace("#", "");

  // Rozdzielamy kolor na składniki R, G i B
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Przyciemniamy każdy składnik (można dostosować wartość amount)
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);

  // Zwracamy nowy kolor w formacie hex
  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`;
}
