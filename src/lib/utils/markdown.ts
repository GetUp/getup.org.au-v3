import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true
});

export function renderMarkdown(md: string): string {
  if (!md) return "";
  return marked.parse(md) as string;
}

export function parseYamlBlock(raw: string) {
  const heading = raw.match(/heading:\s*(.+)/)?.[1]?.trim() ?? "";
  const bodyMatch = raw.match(/body:\s*>\+?\s*([\s\S]*)/);
  let body = bodyMatch ? bodyMatch[1] : "";
  // Stop before nested sections if present
  body = body.split("\nsections:")[0].trim();
  return { heading, body };
}
