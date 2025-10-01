/// <reference lib="webworker" />
import { renderPage } from "vike/server";
// TODO: stop using universal-middleware and directly integrate server middlewares instead and/or use vike-server https://vike.dev/server. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from "@universal-middleware/core";

export const vikeHandler: Get<[], UniversalHandler> = () => async (request, context, runtime) => {
  const pageContextInit = { ...context, ...runtime, urlOriginal: request.url, headersOriginal: request.headers };
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  // Inject html class based on theme cookie by rewriting the first chunk
  const themeCookie = request.headers.get("cookie")?.match(/(?:^|; )theme=([^;]+)/)?.[1];
  const isDark = themeCookie ? decodeURIComponent(themeCookie) === "dark" : false;

  // Create two transform streams: t1 captures Vike output, t2 is what we return after patching first chunk
  const t1 = new TransformStream();
  const t2 = new TransformStream();
  response.pipe(t1.writable);

  const reader = t1.readable.getReader();
  const writer = t2.writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let first = true;
  (async function pump() {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (first) {
        first = false;
        try {
          const text = decoder.decode(value);
          const patched = text.replace(
            /<html(\s[^>]*)?>/i,
            (m, attrs = "") => {
              // If class already present, merge
              const hasClass = /\bclass=\"[^\"]*\"/.test(m);
              if (hasClass) return m.replace(/class=\"([^\"]*)\"/, (_m, cls) => `class=\"${(cls + " " + (isDark ? "dark" : "")).trim()}\"`);
              return `<html${attrs} class=\"${isDark ? "dark" : ""}\">`;
            }
          );
          await writer.write(encoder.encode(patched));
        } catch {
          await writer.write(value);
        }
      } else {
        await writer.write(value);
      }
    }
    await writer.close();
  })();

  return new Response(t2.readable, {
    status: response.statusCode,
    headers: response.headers,
  });
};
