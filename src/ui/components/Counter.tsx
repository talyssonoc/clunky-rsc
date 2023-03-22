"use client";
import * as React from "react";

type CounterProps = {
  children: React.ReactNode;
};

export default function Counter({ children }: CounterProps) {
  const [count, setCount] = React.useState(0);

  function increase() {
    setCount((c) => c + 1);
  }

  return (
    <div>
      {children}
      {count}
      <button onClick={increase}>Increase</button>
    </div>
  );
}
