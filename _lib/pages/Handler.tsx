import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as React from "react";
// @ts-ignore
import * as ReactDOMServer from "react-dom/server";
// @ts-ignore
import * as ReactDOMServerWebpack from "react-server-dom-webpack/writer";
import { FastifyReply, FastifyRequest, RouteHandlerMethod } from "fastify";
import { ROUTE_PAYLOAD_HEADER } from "../shared/routePayloadHeader";

type RoutePayload = {
  params: FastifyRequest["params"];
  query: FastifyRequest["params"];
};

type RouteComponent =
  | React.ComponentType<RoutePayload>
  | ((props: RoutePayload) => Promise<React.ReactElement>);

type createHandlerFactoryDependencies = {
  ReactApp: RouteComponent;
  appDir: string;
};

function createHandlerFactory({
  ReactApp,
  appDir,
}: createHandlerFactoryDependencies) {
  function createPageHandler(
    pageComponent: RouteComponent
  ): RouteHandlerMethod {
    const handler: RouteHandlerMethod = (request, reply) => {
      const routePayload: RoutePayload = {
        params: request.params,
        query: request.query,
      };

      reply.header(ROUTE_PAYLOAD_HEADER, JSON.stringify(routePayload));

      if (request.headers[ROUTE_PAYLOAD_HEADER]) {
        streamReactTree(reply, routePayload, pageComponent);
        return;
      }

      renderReactShell(reply, routePayload);
    };

    return handler;
  }

  async function streamReactTree(
    reply: FastifyReply,
    routePayload: RoutePayload,
    PageComponent: RouteComponent
  ) {
    const moduleMap = await getModuleMap(appDir);

    const { pipe } = ReactDOMServerWebpack.renderToPipeableStream(
      /* @ts-expect-error Async Server Component */
      <PageComponent {...routePayload} />,
      moduleMap
    );

    pipe(reply.raw);
  }

  async function renderReactShell(
    reply: FastifyReply,
    routePayload: RoutePayload
  ) {
    const { pipe } = ReactDOMServer.renderToPipeableStream(
      /* @ts-expect-error Async Server Component */
      <ReactApp {...routePayload} />,
      {
        bootstrapScripts: ["/build/main.js"],
      }
    );
    pipe(reply.raw);
  }

  return createPageHandler;
}

async function getModuleMap(appDir: string) {
  while (true) {
    try {
      const manifest = readFileSync(
        resolve(appDir, "../build/react-client-manifest.json"),
        "utf8"
      );

      const moduleMap = JSON.parse(manifest);

      return moduleMap;
    } catch (err) {
      console.log(
        "Could not find webpack build output. Will retry in a second..."
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export { createHandlerFactory };
export type { RouteComponent };
