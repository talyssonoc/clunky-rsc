// @ts-ignore
import register from "react-server-dom-webpack/node-register";

register();

import { createServer } from "../_lib/server/Server";
import { App } from "./ui/App";
import { routes } from "./ui/routes";

const server = createServer({
  appDir: __dirname,
  routes,
  reactApp: App,
});

server
  .listen({ port: 3000 })
  .then((address) => {
    console.log(`Listening at ${address}`);
  })
  .catch((error) => {
    console.error(error);
    process.exit();
  });
