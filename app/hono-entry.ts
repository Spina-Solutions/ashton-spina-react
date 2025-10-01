import "dotenv/config";
import { vikeHandler } from "./server/vike-handler";
import { tsRestHandler } from "./server/ts-rest-handler";
import { Hono } from "hono";
import { createHandler } from "@universal-middleware/hono";

const app = new Hono();

app.all("/api/*", createHandler(tsRestHandler)());

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", createHandler(vikeHandler)());

export default app;
