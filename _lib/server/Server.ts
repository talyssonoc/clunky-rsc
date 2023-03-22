import { join } from "node:path";
import fastify, { FastifyInstance } from "fastify";
import { Routes } from "../pages/Routes";
import { createHandlerFactory, RouteComponent } from "../pages/Handler";

type ServerDependencies = {
  routes: Routes;
  reactApp: RouteComponent;
  appDir: string;
};

function createServer({
  routes,
  reactApp,
  appDir,
}: ServerDependencies): FastifyInstance {
  const server = fastify();

  server.register(require("@fastify/static"), {
    root: join(appDir, "..", "build"),
    prefix: "/build/",
  });

  server.get("/sleep/:ms", function (req, res) {
    setTimeout(() => {
      res.send({ ok: "true" });
    }, (req.params as any).ms);
  });

  const createHandler = createHandlerFactory({ ReactApp: reactApp, appDir });

  Object.keys(routes).forEach((route) => {
    server.get(route, createHandler(routes[route]));
  });

  return server;
}

export { createServer };
