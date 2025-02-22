import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Odleglosc } from "./database/schema";

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

export enum Card {
  ACEPIK = "A♠️",
  ACETREFL = "A♣️",
  ACECHEART = "A♥️",
  ACEKARO = "A♦️",
  TWOTREFL = "2♣️",
  TWOCHEART = "2♥️",
  TWOKARO = "2♦️",
  TWOPIK = "2♠️",
  THREETREFL = "3♣️",
  THREECHEART = "3♥️",
  THREEKARO = "3♦️",
  THREEPIK = "3♠️",
  FOURTREFL = "4♣️",
  FOURCHEART = "4♥️",
  FOURKARO = "4♦️",
  FOURPIK = "4♠️",
  FIVETREFL = "5♣️",
  FIVECHEART = "5♥️",
  FIVEKARO = "5♦️",
  FIVEPIK = "5♠️",
  SIXTREFL = "6♣️",
  SIXCHEART = "6♥️",
  SIXKARO = "6♦️",
  SIXPIK = "6♠️",
  SEVENTREFL = "7♣️",
  SEVENCHEART = "7♥️",
  SEVENKARO = "7♦️",
  SEVENPIK = "7♠️",
  EIGHTTREFL = "8♣️",
  EIGHTCHEART = "8♥️",
  EIGHTKARO = "8♦️",
  EIGHTPIK = "8♠️",
  NINETREFL = "9♣️",
  NINECHEART = "9♥️",
  NINEKARO = "9♦️",
  NINEPIK = "9♠️",
  TENTREFL = "10♣️",
  TENCHEART = "10♥️",
  TENKARO = "10♦️",
  TENPIK = "10♠️",
  JACKTREFL = "J♣️",
  JACKCHEART = "J♥️",
  JACKKARO = "J♦️",
  JACKPIK = "J♠️",
  QUEENTREFL = "Q♣️",
  QUEENCHEART = "Q♥️",
  QUEENKARO = "Q♦️",
  QUEENPIK = "Q♠️",
  KINGTREFL = "K♣️",
  KINGCHEART = "K♥️",
  KINGKARO = "K♦️",
  KINGPIK = "K♠️",
}

export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export type RouteValue = `${number}|${number}|${string}`;

export function getRouteValue(trasa: Odleglosc) {
  return `${trasa.id}|${trasa.odleglosc}|${trasa.startTrasy} -> ${trasa.koniecTrasy}` as RouteValue;
}

export function getRouteLength(routeValue: RouteValue) {
  return parseFloat(routeValue.split("|")[1]);
}

export function getRoutePath(routeValue: RouteValue) {
  return routeValue.split("|")[2];
}
