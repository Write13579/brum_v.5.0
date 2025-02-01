"use client";

import { darkenHexColor } from "@/lib/utils";

export default function OutputComp({
  liczba,
  opis,
  kolor,
}: {
  liczba: number;
  opis: string;
  kolor: string;
}) {
  return (
    <div
      id={opis}
      className={`border-2 border-black rounded-lg p-2 font-semibold w-full text-white`}
      style={{ borderColor: kolor, backgroundColor: kolor }}
    >
      <div className="text-nowrap">{opis}</div>
      <div className="flex items-baseline justify-center gap-1 mt-1">
        <div
          style={{
            color: darkenHexColor(kolor, 85),
            textShadow: `0 0 6px ${darkenHexColor(kolor, 40)}`,
          }}
          className="text-xl font-bold"
        >
          {liczba ? (liczba !== Infinity ? liczba : 0) : 0}
        </div>
        <div className="text-white/70 text-sm">zł</div>
      </div>
    </div>
  );
}
