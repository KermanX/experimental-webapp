import type { Options } from "tsup";

export const tsup: Options = {
  entry: ["src/*.ts"],
  format: ["esm"],
  target: "esnext",
  splitting: false,
  clean: true,
  esbuildPlugins:[]
};
