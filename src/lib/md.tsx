// A tiny Markdown renderer for our own docs (headings, paragraphs, lists, bold, italics, code, links).
// No dependency: our research and log files use only these.
import fs from "fs";
import path from "path";
import type { ReactNode } from "react";

export type Section = { title: string; body: string };

export function readDoc(rel: string) {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

/** Split a document on its "## " headings. The text before the first one is the intro. */
export function sections(md: string): { title: string; intro: string; sections: Section[] } {
  const lines = md.split("\n");
  const title = (lines.find((l) => l.startsWith("# ")) ?? "").slice(2).trim();
  const out: Section[] = [];
  let intro: string[] = [];
  let cur: Section | null = null;
  for (const l of lines) {
    if (l.startsWith("# ")) continue;
    if (l.startsWith("## ")) {
      if (cur) out.push(cur);
      cur = { title: l.slice(3).trim(), body: "" };
    } else if (cur) cur.body += l + "\n";
    else intro.push(l);
  }
  if (cur) out.push(cur);
  return { title, intro: intro.join("\n").trim(), sections: out };
}

let k = 0;
export function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[2]) parts.push(<strong key={k++} className="font-semibold text-ink">{m[2]}</strong>);
    else if (m[3]) parts.push(<em key={k++}>{m[3]}</em>);
    else if (m[4]) parts.push(<code key={k++} className="rounded-sm bg-paper-3 px-1 py-0.5 text-[0.9em]">{m[4]}</code>);
    else if (m[5]) parts.push(<a key={k++} href={m[6]} className="text-link underline underline-offset-2">{m[5]}</a>);
    else if (m[7]) parts.push(<a key={k++} href={m[7]} className="break-all text-link underline underline-offset-2">{new URL(m[7]).hostname.replace("www.", "")}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

/** Render block-level Markdown: paragraphs, "- " and "1. " lists (one level), "### " subheads. */
export function Markdown({ md, className = "" }: { md: string; className?: string }) {
  const blocks: ReactNode[] = [];
  const lines = md.split("\n");
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    if (l.startsWith("### ")) { blocks.push(<h4 key={k++} className="mt-4 font-display text-lg text-ink">{inline(l.slice(4))}</h4>); i++; continue; }
    if (/^\s*[-*] /.test(l) || /^\s*\d+\. /.test(l)) {
      const ordered = /^\s*\d+\. /.test(l);
      const items: string[] = [];
      while (i < lines.length && (/^\s*[-*] /.test(lines[i]) || /^\s*\d+\. /.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.) /.test(lines[i])) items[items.length - 1] += " " + lines[i].trim();
        else items.push(lines[i].replace(/^\s*([-*]|\d+\.) /, ""));
        i++;
      }
      const L = ordered ? "ol" : "ul";
      blocks.push(<L key={k++} className={`mt-2 grid gap-1.5 pl-5 ${ordered ? "list-decimal" : "list-disc"} marker:text-ink-2`}>{items.map((t) => <li key={k++}>{inline(t)}</li>)}</L>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*([-*]|\d+\.) /.test(lines[i]) && !lines[i].startsWith("#")) para.push(lines[i++]);
    blocks.push(<p key={k++} className="mt-2">{inline(para.join(" "))}</p>);
  }
  return <div className={`text-[15px] leading-relaxed text-ink-2 ${className}`}>{blocks}</div>;
}

/** The Images section of a research doc → [{src, caption, source}]. */
export function researchImages(body: string) {
  return [...body.matchAll(/^- `public(\/research\/[^`]+)`:\s*(.*?)\s*Source:\s*(\S+)/gm)].map((m) => ({ src: m[1], caption: m[2].replace(/\*\*/g, "").replace(/\.$/, ""), source: m[3] }));
}
