import { describe, it, expect } from "vitest";
import { parseMarkdown, parseInline, isSafeHref } from "../utils/markdown.js";

describe("parseMarkdown", () => {
  it("parses headings by level", () => {
    expect(parseMarkdown("# One\n## Two\n### Three")).toEqual([
      { type: "heading", level: 1, text: "One" },
      { type: "heading", level: 2, text: "Two" },
      { type: "heading", level: 3, text: "Three" },
    ]);
  });

  it("joins wrapped lines into one paragraph and splits on blank lines", () => {
    expect(parseMarkdown("first line\nsecond line\n\nnext para")).toEqual([
      { type: "paragraph", text: "first line second line" },
      { type: "paragraph", text: "next para" },
    ]);
  });

  it("groups list items and ends the list at a paragraph", () => {
    expect(parseMarkdown("Intro:\n- a\n- b\nAfter")).toEqual([
      { type: "paragraph", text: "Intro:" },
      { type: "list", ordered: false, items: ["a", "b"] },
      { type: "paragraph", text: "After" },
    ]);
  });

  it("separates ordered and unordered lists that touch", () => {
    expect(parseMarkdown("- a\n1. b\n2. c")).toEqual([
      { type: "list", ordered: false, items: ["a"] },
      { type: "list", ordered: true, items: ["b", "c"] },
    ]);
  });

  it("parses quotes and handles CRLF and empty input", () => {
    expect(parseMarkdown("> hi\r\n")).toEqual([{ type: "quote", text: "hi" }]);
    expect(parseMarkdown("")).toEqual([]);
  });

  it("does not treat #hashtags without a space as headings", () => {
    expect(parseMarkdown("#travel")).toEqual([{ type: "paragraph", text: "#travel" }]);
  });
});

describe("parseInline", () => {
  it("returns plain text untouched", () => {
    expect(parseInline("just text")).toEqual([{ type: "text", text: "just text" }]);
  });

  it("parses bold, italics and links in order", () => {
    expect(parseInline("**TL;DR:** see [docs](https://x.dev) *now*")).toEqual([
      { type: "strong", text: "TL;DR:" },
      { type: "text", text: " see " },
      { type: "link", text: "docs", href: "https://x.dev" },
      { type: "text", text: " " },
      { type: "em", text: "now" },
    ]);
  });

  it("leaves unmatched markers and multiplication alone", () => {
    expect(parseInline("2 * 3 and a lone ** pair")).toEqual([{ type: "text", text: "2 * 3 and a lone ** pair" }]);
  });
});

describe("isSafeHref", () => {
  it("allows web, mail and relative links", () => {
    expect(isSafeHref("https://a.com")).toBe(true);
    expect(isSafeHref("mailto:a@b.c")).toBe(true);
    expect(isSafeHref("/media")).toBe(true);
  });

  it("rejects script and protocol-relative links", () => {
    expect(isSafeHref("javascript:alert(1)")).toBe(false);
    expect(isSafeHref("//evil.com")).toBe(false);
  });
});
