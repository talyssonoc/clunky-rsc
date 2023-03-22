import { Routes } from "../../_lib/pages/Routes";
import { Entry } from "./pages/Entry";
import { Home } from "./pages/Home";

const routes = {
  "/": Home,
  "/abc/:name": Entry,
} satisfies Routes;

export { routes };
