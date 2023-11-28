import NodePlugin from "./.ladle/vite-plugin-node.js";

export default {
  define: {
    "process.env.BABEL_TYPES_8_BREAKING": JSON.stringify("true"),
  },
  plugins: [NodePlugin()],
  server: {
    open:
      process.env.TYPE === "prod" || process.env.TYPE === "dev"
        ? "none"
        : undefined,
    host: "127.0.0.1",
  },
  build: {
    commonjsOptions: {
      strictRequires: true,
    },
    rollupOptions: {
      onLog: (_, log) => {
        // Rollup 4 warns about misplaced "PURE" comments
        // these help three-shaking but not critical when bundling
        if (log.message.includes("due to the position of the comment")) {
          return;
        }
      },
    },
  },
};
