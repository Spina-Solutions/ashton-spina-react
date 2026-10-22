import { useMemo } from "react";
import { parseMarkdown, parseInline, isSafeHref, type BlockNode } from "../utils/markdown.js";

export function Markdown({ source, skipTitle = false }: { source: string; skipTitle?: boolean }) {
  const blocks = useMemo(() => {
    const parsed = parseMarkdown(source);
    // The page header already shows the title, so drop a leading H1.
    return skipTitle && parsed[0]?.type === "heading" && parsed[0].level === 1 ? parsed.slice(1) : parsed;
  }, [source, skipTitle]);

  return (
    <div className={"space-y-5 text-[1.075rem] leading-[1.75]"}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

function Block({ block }: { block: BlockNode }) {
  switch (block.type) {
    case "heading": {
      const classes = {
        1: "text-4xl font-medium tracking-tight pt-4",
        2: "text-3xl font-medium tracking-tight pt-6",
        3: "text-xl font-medium pt-2",
      }[block.level];
      const Tag = (`h${block.level + 1}` as "h2" | "h3" | "h4");
      return <Tag className={classes}><Inline text={block.text} /></Tag>;
    }
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag className={`space-y-2 pl-6 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-coral`}>
          {block.items.map((item, i) => (
            <li key={i}><Inline text={item} /></li>
          ))}
        </Tag>
      );
    }
    case "quote":
      return (
        <blockquote className={"border-l-4 border-coral pl-4 italic opacity-80"}>
          <Inline text={block.text} />
        </blockquote>
      );
    default:
      return <p className={"opacity-90"}><Inline text={block.text} /></p>;
  }
}

function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((node, i) => {
        if (node.type === "strong") return <strong key={i} className={"font-semibold"}>{node.text}</strong>;
        if (node.type === "em") return <em key={i}>{node.text}</em>;
        if (node.type === "link" && isSafeHref(node.href)) {
          const external = node.href.startsWith("http");
          return (
            <a
              key={i}
              href={node.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className={"underline decoration-coral decoration-2 underline-offset-4 hover:text-coral transition-colors"}
            >
              {node.text}
            </a>
          );
        }
        return <span key={i}>{node.text}</span>;
      })}
    </>
  );
}
