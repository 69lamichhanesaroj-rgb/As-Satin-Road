import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/robots.txt": new Response("User-agent: *\nAllow: /\n", {
      headers: { "content-type": "text/plain" },
    }),
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
