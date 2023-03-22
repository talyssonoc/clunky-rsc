// @ts-ignore
import { unstable_getCacheForType } from "react";
// @ts-ignore
import { createFromFetch } from "react-server-dom-webpack";
import { ROUTE_PAYLOAD_HEADER } from "../shared/routePayloadHeader";

// export function useRefresh() {
//   const refreshCache = unstable_useCacheRefresh();
//   return function refresh(key, seededResponse) {
//     refreshCache(createResponseCache, new Map([[key, seededResponse]]));
//   };
// }

function useServerResponse() {
  const { pathname, search } = document.location;
  const location = `${pathname}${search}`;
  const key = JSON.stringify(location);

  const cache = unstable_getCacheForType(createResponseCache);
  let response = cache.get(key);

  if (response) {
    return response;
  }

  response = createFromFetch(
    fetch(location, {
      headers: {
        [ROUTE_PAYLOAD_HEADER]: key,
      },
    })
  );
  cache.set(key, response);

  return response;
}

function createResponseCache() {
  return new Map();
}

export { useServerResponse };
