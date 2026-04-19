import "dotenv/config";
import { vikeHandler } from "./server/vike-handler";
import { tsRestHandler } from "./server/ts-rest-handler";
import { Hono } from "hono";
import { createHandler } from "@universal-middleware/hono";

const app = new Hono();

/**
 * Browsers/extensions (e.g. React DevTools) may request source maps like `/installHook.js.map`
 * from the page origin. Those files are not part of the app; `serveStatic` / Vite already
 * serve real `.map` assets under `/assets/` etc. Anything else hitting this app should 404
 * instead of going through Vike (which can error and log a 500).
 */
app.use("*", async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  if (pathname.endsWith(".map")) {
    return new Response(null, { status: 404 });
  }
  await next();
});

app.all("/api/*", createHandler(tsRestHandler)());

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", createHandler(vikeHandler)());

export default app;
