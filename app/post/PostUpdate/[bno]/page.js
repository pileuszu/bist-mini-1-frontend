import PostUpdateClient from "./PostUpdateClient";

export function generateStaticParams() {
  const bnos = ["1", "2", "3", "4", "5"];
  for (let i = 1; i <= 32; i++) {
    bnos.push(String(10 + i));
  }
  return bnos.map((bno) => ({ bno }));
}

export default function Page() {
  return <PostUpdateClient />;
}
