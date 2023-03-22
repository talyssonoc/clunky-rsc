"use client";
// @ts-ignore
import { createRoot } from "react-dom/client";
import { ClientApp } from "./ClientApp";

const root = createRoot(document.getElementById("root"));
root.render(<ClientApp />);
