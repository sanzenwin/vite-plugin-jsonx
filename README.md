# vite-plugin-jsonx

This is a Vite plugin that enables you to import JSONC and JSON5 files as modules in your Vite project.

## Features

- Import JSON5 files as modules
- Import JSONC files as modules
- Customizable parse options for both JSON5 and JSONC files

## Installation

You can install the plugin using npm:

    npm install vite-plugin-jsonx --save-dev

Or you can use yarn:

    yarn add vite-plugin-jsonx --dev

## Usage

To use this plugin, first add it to your vite.config.js or vite.config.ts:

```js
import vitePluginJsonx from 'vite-plugin-jsonx';

export default {
  plugins: [
    vitePluginJsonx({
      json5Options: {}, // optional, custom options for json5
      jsoncOptions: {}  // optional, custom options for jsonc
    })
  ]
}
```

With this setup, you can now import JSONC and JSON5 files in your application:

    import datac from './data.jsonc';
    import data5 from './data.json5';

## Options

This plugin supports the following options:

- `jsoncOptions`: An optional object with custom parsing options for JSONC files.
- `json5Options`: An optional object with custom parsing options for JSON5 files.
