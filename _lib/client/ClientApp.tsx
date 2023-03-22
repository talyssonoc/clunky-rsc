"use client";
// @ts-ignore
import { Suspense, use } from "react";
import { useServerResponse } from "./useServerResponse";

function ClientApp() {
  return (
    // @ts-ignore
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const response = useServerResponse();
  const root = use(response);
  return root;
}

export { ClientApp };
