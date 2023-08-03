import { Plugin } from "vite";
import MagicString from "magic-string";

export default function myExample() {
  const ctx = { id: 0 };
  return {
    name: "web-imgui-plugin", // 此名称将出现在警告和错误中
    enforce: "pre",
    transform(code, id, options) {
      if (!id.endsWith(".imgui.ts")) {
        return null;
      }
      const s = new MagicString(code);
      s.replaceAll(
        /_\s*\.\s*([a-zA-Z0-9_]+)\s*<\s*\"([\s\S]*?)\",?([\s\S]*?)>\s*\(([\s\S]*?)\)(\s*\.as\s*\(([\s\S]+?)\))?/g,
        (_, name, selector,typeargs, args, _2, ref = null) => {
          ctx.id++;
          return `_.$.${name}${typeargs.length>0?`<${typeargs}>`:""}(${ctx.id}, ${generateMetadata(
            selector,
            ref
          )}, ${args})`;
        }
      );
      s.replaceAll(
        /_\s*\.\s*([a-zA-Z0-9_]+)\s*\(\s*([\s\S]*?)\s*\)(\s*\.as\s*\(([\s\S]+?)\))?/g,
        (_, name, args, _2, ref = null) => {
          ctx.id++;
          return `_.$.${name}(${ctx.id}, ${generateMetadata(
            "",
            ref
          )}, ${args})`;
        }
      );
      const map = s.generateMap({
        source: id,
        file: id + ".map",
        includeContent: true,
      });
      return {
        code: s.toString(),
        map,
      };
    },
  } satisfies Plugin;
}

function parseSelector(selector: string) {
  let id: string | null = null;
  let classes: string[] = [];
  let style: string | null = null;
  let state = "init" as "init" | "id" | "cls" | "style";
  for (const c of selector) {
    if (c === "#") {
      if (state !== "init" && state !== "cls")
        throw new Error("invalid selector");
      id = "";
      state = "id";
    } else if (c === ".") {
      if (state !== "init" && state !== "id" && state !== "cls")
        throw new Error("invalid selector");
      classes.push("");
      state = "cls";
    } else if (c === "{") {
      if (state !== "init" && state !== "id" && state !== "cls")
        throw new Error("invalid selector");
      style = "";
      state = "style";
    } else if (c === "}") {
      if (state !== "style") throw new Error("invalid selector");
      state = "init";
    } else {
      switch (state) {
        case "init":
          throw new Error("invalid selector");
        case "id":
          id! += c;
          break;
        case "cls":
          classes[classes.length - 1] += c;
          break;
        case "style":
          style! += c;
          break;
      }
    }
  }
  if (state === "style") throw new Error("invalid selector: missing '}'");
  return { id, classes, style };
}

function generateMetadata(selector: string, ref: string | null) {
  const { id, classes, style } = parseSelector(selector);
  return `{${id ? `id:"${id}",` : ""}${
      classes.length > 0
        ? `classes:[${classes.map((c) => `"${c}"`).join(",")}],`
        : ""
    }${style ? `style:"${style}",` : ""}${ref ? `ref:${ref},` : ""}}`;
}
