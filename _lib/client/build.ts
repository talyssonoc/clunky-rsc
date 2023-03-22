import { resolve } from "node:path";
import rimraf from "rimraf";
import webpack from "webpack";
// @ts-ignore
import ReactServerWebpackPlugin from "react-server-dom-webpack/plugin";

const isProduction = process.env.NODE_ENV === "production";
rimraf.sync(resolve(__dirname, "../../build"));
webpack(
  {
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    entry: [resolve(__dirname, "./root.client.tsx")],
    output: {
      path: resolve(__dirname, "../../build"),
      filename: "main.js",
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      extensionAlias: {
        ".js": [".js", ".ts"],
      },
    },
    module: {
      rules: [{ test: /\.(ts|tsx)$/, loader: "ts-loader" }],
    },
    plugins: [new ReactServerWebpackPlugin({ isServer: false })],
  },
  (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if ((err as any).details) {
        console.error((err as any).details);
      }
      process.exit(1);
      return;
    }

    const info = stats!.toJson();
    if (stats!.hasErrors()) {
      console.log("Finished running webpack with errors.");
      info.errors!.forEach((e) => console.error(e));
      process.exit(1);
    } else {
      console.log("Finished running webpack.");
    }
  }
);
