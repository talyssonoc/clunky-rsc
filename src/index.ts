import { createServer } from "../_lib/server/Server";
import { App } from "./ui/App.server";
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
