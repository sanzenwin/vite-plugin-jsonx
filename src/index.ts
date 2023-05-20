import fs from "fs";
//@ts-ignore
import { safe as jsonc } from "jsonc";
import type { IParseOptions, Reviver } from "jsonc/lib/interfaces";
import { createRequire } from "module";
import type { Plugin } from "vite";

// Create a require function
const require = createRequire(import.meta.url);
const json5 = require("json5");

interface PluginOptions {
  jsoncOptions?: IParseOptions | Reviver;
  json5Options?: ((this: any, key: string, value: any) => any) | null;
}

const vitePluginJsonx = (
  { json5Options: json5ParseOptions, jsoncOptions: jsoncParseOptions }: PluginOptions = {
    json5Options: null,
  }
): Plugin => {
  return {
    name: "vite-plugin-jsonx", // name of the plugin

    resolveId(id: string) {
      if (id.endsWith(".json5") || id.endsWith(".jsonc")) {
        return id; // this signals that we want to resolve this module ourselves in `load()`
      }
    },

    async load(id: string) {
      try {
        if (id.endsWith(".json5")) {
          const content = fs.readFileSync(id, "utf-8");
          const data = json5.parse(content, json5ParseOptions);
          return `export default ${JSON.stringify(data)};`;
        }

        if (id.endsWith(".jsonc")) {
          const content = fs.readFileSync(id, "utf-8");
          const [err, data] = jsonc.parse(content, jsoncParseOptions);
          if (err) throw new Error(err.message);
          return `export default ${JSON.stringify(data)};`;
        }
      } catch (error: any) {
        throw new Error(`Error while parsing ${id}: ${error.message}`);
      }
    },
  };
};

export default vitePluginJsonx;
