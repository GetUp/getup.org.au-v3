import { error } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const prerender = true;

export function entries() {
    const slugs = new Set<string>();
    const dirs = ['content/basic-pages', 'content/pages'];
    const excluded = ['home', 'about', 'donate', 'campaigns', 'reports', 'unsubscribe', 'welcome', 'design', 'edit', 'transparency'];

    for (const dir of dirs) {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const slug = file.replace('.json', '');
                if (!excluded.includes(slug)) {
                    slugs.add(slug);
                }
            }
        }
    }
    return Array.from(slugs).map(slug => ({ slug }));
}

export async function load({ params }) {
    const { slug } = params;

    // Check basic-pages first
    let filePath = path.resolve('content/basic-pages', `${slug}.json`);

    if (!fs.existsSync(filePath)) {
        // Check pages collection
        filePath = path.resolve('content/pages', `${slug}.json`);
    }

    if (!fs.existsSync(filePath)) {
        throw error(404, 'Page not found');
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    return {
        page: data
    };
}
