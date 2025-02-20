import Link from "next/link";

export default function Home() {
  return (
    <div id="alles">
      <div id="kafle" className="flex flex-col gap-2 ">
        <Link href={"/obliczTrase"}>Straße</Link>
        <Link href={"/obliczTrase+"}>Straße+</Link>
        <Link href={"/niger"}>Tanken</Link>
        <Link href={"/tanken+"}>Tanken+</Link>
        <Link href={"/blackjack"}>Blackjack</Link>
      </div>
    </div>
  );
}
