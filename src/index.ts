import fs from "fs";
import {jsonc} from "jsonc";
import json5 from "json5";
import {Plugin} from "vite";

interface Map {
  [key: string]: string;
}

interface PluginOptions {
  json5ParserOptions?: Parameters<typeof json5.parse>[1];
  jsoncParserOptions?: Parameters<typeof jsonc.safe.parse>[1];
  map?: Map;
}

const mapDefault: Map = {
  'json5': 'json5',
  'jsonc': 'jsonc',
  'json': 'json'
}

const typeList = Object.values(mapDefault)

function getExt(name: string) {
  return name.slice((Math.max(0, name.lastIndexOf(".")) || Infinity) + 1)
}

function getType(map: Map | undefined, name: string) {
  const mapFinal: Map = {...mapDefault, ...map}
  return mapFinal[getExt(name)]
}

/**
 * Vite plugin for importing JSONC and JSON5 files as JSON.
 *
 * @param {object} options.json5ParserOptions - More details: https://github.com/json5/json5#json5parse
 * @param {object} options.jsoncParserOptions - More details: https://onury.io/jsonc//api#jsonc.safe.parse
 */
export const jsonX = ({json5ParserOptions, jsoncParserOptions, map}: PluginOptions = {}): Plugin => {
  return {
    name: "vite-plugin-jsonx", // name of the plugin

    resolveId(id: string) {
      if (typeList.includes(getType(map, id))) {
        return id; // this signals that we want to resolve this module ourselves in `load()`
      }
      return null; // otherwise let other plugins handle it
    },

    async load(id: string) {
      const type = getType(map, id)
      try {
        if (type === "json") {
          const content = fs.readFileSync(id, "utf-8");
          const data = json5.parse(content, json5ParserOptions);
          return JSON.stringify(data);
        } else if (type === "json5") {
          const content = fs.readFileSync(id, "utf-8");
          const data = json5.parse(content, json5ParserOptions);
          return `export default ${JSON.stringify(data)};`;
        } else if (type === "jsonc") {
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
