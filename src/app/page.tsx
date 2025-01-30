import Link from "next/link";

export default function Home() {
  return (
    <div id="alles">
      <h1>Home</h1>
      <Link href={"/obliczTrase"}>Oblicz trase</Link>
    </div>
  );
}
