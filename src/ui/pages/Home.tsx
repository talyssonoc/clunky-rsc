import { Suspense } from "react";
import { fetch } from "../../../_lib/client/reactFetch";
import Counter from "../components/Counter";
import { ServerTime } from "../components/ServerTime";

async function Home() {
  const data = await getData();

  return (
    <div>
      Teste {data.ok}
      <Counter>
        {/* @ts-expect-error Async Server Component */}
        <ServerTime />
      </Counter>
      <Suspense fallback={<div>Loading</div>}>
        <HomeContent />
      </Suspense>
    </div>
  );
}

function HomeContent() {
  const data = fetch("http://localhost:3000/sleep/3000").json();

  return <div>{data.ok}</div>;
}

async function getData(): Promise<{ ok: string }> {
  return new Promise((res) => {
    setTimeout(() => res({ ok: "loaded" }), 2000);
  });
}

export { Home };
