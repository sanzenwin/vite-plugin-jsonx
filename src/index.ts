import fs from "fs";
import { jsonc } from "jsonc";
import json5 from "json5";
import { Plugin } from "vite";

interface PluginOptions {
  json5ParserOptions?: Parameters<typeof json5.parse>[1];
  jsoncParserOptions?: Parameters<typeof jsonc.safe.parse>[1];
}

/**
 * Vite plugin for importing JSONC and JSON5 files as JSON.
 *
 * @param {object} options.json5ParserOptions - More details: https://github.com/json5/json5#json5parse
 * @param {object} options.jsoncParserOptions - More details: https://onury.io/jsonc//api#jsonc.safe.parse
 */
export const jsonX = ({
  json5ParserOptions,
  jsoncParserOptions,
}: PluginOptions = {}): Plugin => {
  return {
    name: "vite-plugin-jsonx", // name of the plugin

    resolveId(id: string) {
      if (id.endsWith(".json5") || id.endsWith(".jsonc")) {
        return id; // this signals that we want to resolve this module ourselves in `load()`
      }

      return null; // otherwise let other plugins handle it
    },

    async load(id: string) {
      try {
        if (id.endsWith(".json5")) {
          const content = fs.readFileSync(id, "utf-8");
          const data = json5.parse(content, json5ParserOptions);
          return `export default ${JSON.stringify(data)};`;
        }

        if (id.endsWith(".jsonc")) {
          const content = fs.readFileSync(id, "utf-8");
          const [err, data] = jsonc.safe.parse(content, jsoncParserOptions);
          if (err) throw new Error(err.message);
          return `export default ${JSON.stringify(data)};`;
        }
      } catch (error) {
        throw new Error(
          `Error while parsing ${id}:: ${(error as any).message}`
        );
      }

      return null; // other ids should be handled as usually
    },
  };
};
