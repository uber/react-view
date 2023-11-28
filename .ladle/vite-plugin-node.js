/* eslint-env node */

import { builtinModules } from "node:module";
import nodeLibsBrowser from "node-libs-browser";

function NodeBuiltinsPolyfillPlugin() {
  return {
    name: "vite:node-builtins-polyfill",
    config() {
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
