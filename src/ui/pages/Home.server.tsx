import { Suspense } from "react";
// @ts-ignore
import { fetch } from "react-fetch";
// import Counter from "../components/Counter.client";

function Home() {
  const data = fetch("http://localhost:3000/sleep/1000").json();

  return (
    <div>
      Teste {data.ok}
      {/* <Counter /> */}
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

export { Home };
