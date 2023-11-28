/* eslint-env node */

import { builtinModules, createRequire } from "node:module";
import nodeLibsBrowser from "node-libs-browser";

const require = createRequire(import.meta.url);

function NodeBuiltinsPolyfillPlugin() {
  return {
    name: "vite:node-builtins-polyfill",
    config(config) {
      const aliasEntries = [];
      for (let moduleName of builtinModules) {
        const polyfillPath = nodeLibsBrowser[moduleName];
        if (polyfillPath) {
          aliasEntries.push({
            // eslint-disable-next-line
            find: new RegExp(`^${moduleName}\/?$`), // handle "string_decoder/" import
            replacement: polyfillPath,
          });
        }
      }

      return {
        resolve: {
          alias: aliasEntries,
        },
      };
    },
  };
}

export default NodeBuiltinsPolyfillPlugin;
