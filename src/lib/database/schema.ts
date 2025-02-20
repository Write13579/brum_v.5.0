import {
  pgTable,
  serial,
  varchar,
  integer,
  doublePrecision,
} from "drizzle-orm/pg-core";

export const createEnum = <T extends { [key: string]: string }>(
  e: T
): [T[keyof T], ...[T[keyof T]]] =>
  Object.values(e) as unknown as [T[keyof T], ...[T[keyof T]]];

export const odleglosci = pgTable("odleglosci", {
  id: serial("id").primaryKey(),
  startTrasy: varchar("start").notNull(),
  koniecTrasy: varchar("koniec").notNull(),
  odleglosc: doublePrecision("odleglosc").notNull(),
});

export type Odleglosc = typeof odleglosci.$inferSelect;
