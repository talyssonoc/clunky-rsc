import { Routes } from "../../_lib/pages/Routes";
import { Entry } from "./pages/Entry.server";
import { Home } from "./pages/Home.server";

const routes = {
  "/": Home,
  "/abc/:name": Entry,
} satisfies Routes;

export { routes };
