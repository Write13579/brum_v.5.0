import { db } from "@/lib/database";
import { InputyDlaTrasy } from "./InputyDlaTrasy";

export const dynamic = "force-dynamic"; //vercel sie cos pultal

export default async function page() {
  async function pobierzTrasy() {
    const trasy = await db.query.odleglosci.findMany();
    return trasy;
  }

  const trasy = await pobierzTrasy();

  return (
    <div id="alles">
      <div id="inputy">
        <InputyDlaTrasy trasy={trasy} />
      </div>
    </div>
  );
}
