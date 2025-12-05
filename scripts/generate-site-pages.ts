import { promises as fs } from 'fs';
import path from 'path';

const ROUTES_DIR = path.join(process.cwd(), 'src', 'routes');
const OUTPUT_FILE = path.join(process.cwd(), 'content', 'site-pages.json');

const PAGE_FILES = new Set(['+page.svelte', '+page.ts', '+page.js', '+page.md', '+page.svx']);

type PageEntry = { path: string; label: string };

const isRouteSegmentVisible = (segment: string) => {
  if (!segment) return false;
  // Ignore dynamic segments and route groups
  if (segment.includes('[') || segment.startsWith('(') || segment.startsWith('_')) return false;
  return true;
};

const humanize = (segment: string) =>
  segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

async function walk(dir: string, segments: string[] = []): Promise<PageEntry[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const pages: PageEntry[] = [];

  const hasPageFile = entries.some((entry) => entry.isFile() && PAGE_FILES.has(entry.name));
  if (hasPageFile) {
    const pathSegments = segments.filter(isRouteSegmentVisible);
    const routePath = '/' + pathSegments.join('/');
    const label =
      routePath === '/' ? 'Home' : pathSegments.map(humanize).join(' > ') || routePath;
    pages.push({ path: routePath === '//' ? '/' : routePath, label });
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const childDir = path.join(dir, entry.name);
    const childSegments = [...segments, entry.name];
    pages.push(...(await walk(childDir, childSegments)));
  }

  return pages;
}

async function main() {
  const pages = await walk(ROUTES_DIR);

  // Deduplicate and sort
  const unique = new Map<string, PageEntry>();
  for (const page of pages) {
    unique.set(page.path, page);
  }
  const sorted = Array.from(unique.values()).sort((a, b) => a.path.localeCompare(b.path));

  await fs.writeFile(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        pages: sorted,
      },
      null,
      2,
    ),
  );

  console.log(`Generated ${sorted.length} site pages -> ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
