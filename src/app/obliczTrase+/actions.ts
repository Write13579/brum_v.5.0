"use server";

import { db } from "@/lib/database";
import { odleglosci } from "@/lib/database/schema";

export async function dodajTrase(
  startTrasy: string,
  koniecTrasy: string,
  odleglosc: number
) {
  if (startTrasy.length === 0 || koniecTrasy.length === 0)
    return { data: null, errors: [] };

  await db.insert(odleglosci).values({ startTrasy, koniecTrasy, odleglosc });
  return { errors: [] };
}
