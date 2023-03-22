import { Suspense } from "react";
import { useServerResponse } from "./useServerResponse.client";

function ClientApp() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}

function Content() {
  const response = useServerResponse();
  return <>{response.readRoot()}</>;
}

export { ClientApp };
