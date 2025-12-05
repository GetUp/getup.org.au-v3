import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true
});

const h2Class = "text-2xl mb-6 font-subheader text-slate-900";

export function styleHeadings(html: string): string {
  if (!html) return "";
  let converted = html
    .replace(/<h1[^>]*>/g, `<h2 class="${h2Class}">`)
    .replace(/<\/h1>/g, "</h2>");
  converted = converted.replace(/<h2[^>]*>/g, `<h2 class="${h2Class}">`);
  return converted;
}

export function renderMarkdown(md: string): string {
  if (!md) return "";
  const html = marked.parse(md) as string;
  return styleHeadings(html);
}

export function parseYamlBlock(raw: string) {
  const heading = raw.match(/heading:\s*(.+)/)?.[1]?.trim() ?? "";
  const bodyMatch = raw.match(/body:\s*>\+?\s*([\s\S]*)/);
  let body = bodyMatch ? bodyMatch[1] : "";
  // Stop before nested sections if present
  body = body.split("\nsections:")[0].trim();
  return { heading, body };
}
