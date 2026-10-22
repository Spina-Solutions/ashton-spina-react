// Minimal markdown for site articles: headings, paragraphs, lists, bold, italics and links.

export type InlineNode =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "em"; text: string }
  | { type: "link"; text: string; href: string };

export type BlockNode =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "quote"; text: string };

const HEADING = /^(#{1,3})\s+(.*)$/;
const UNORDERED_ITEM = /^\s*[-*]\s+(.*)$/;
const ORDERED_ITEM = /^\s*\d+\.\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;

export function parseMarkdown(source: string): BlockNode[] {
  const blocks: BlockNode[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length > 0) blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "list", ...list });
    list = null;
  };

  for (const raw of source.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trimEnd();

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ type: "heading", level: heading[1].length as 1 | 2 | 3, text: heading[2].trim() });
      continue;
    }

    const unordered = UNORDERED_ITEM.exec(line);
    const ordered = unordered ? null : ORDERED_ITEM.exec(line);
    const item = unordered ?? ordered;
    if (item) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list ??= { ordered: isOrdered, items: [] };
      list.items.push(item[1].trim());
      continue;
    }

    const quote = QUOTE.exec(line);
    if (quote) {
      flushParagraph();
      flushList();
      blocks.push({ type: "quote", text: quote[1].trim() });
      continue;
    }

    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  return blocks;
}

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\w)/g;

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let last = 0;

  for (const match of text.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push({ type: "text", text: text.slice(last, index) });
    if (match[1] !== undefined) nodes.push({ type: "strong", text: match[1] });
    else if (match[2] !== undefined) nodes.push({ type: "link", text: match[2], href: match[3] });
    else nodes.push({ type: "em", text: match[4] });
    last = index + match[0].length;
  }

  if (last < text.length) nodes.push({ type: "text", text: text.slice(last) });
  return nodes;
}

// Only http(s), mailto and site-relative links are rendered as links.
export function isSafeHref(href: string): boolean {
  return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href);
}
