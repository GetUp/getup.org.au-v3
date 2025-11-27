import fs from 'fs';
import yaml from 'js-yaml';
import { marked } from 'marked';

export async function load() {
    const fileContent = fs.readFileSync('content/privacy-policy.yaml', 'utf8');
    const data = yaml.load(fileContent);

    // Parse markdown for body
    const bodyHtml = await marked.parse(data.body || '');

    // Parse markdown for sections
    const sections = await Promise.all(
        (data.sections || []).map(async (section) => ({
            heading: section.heading,
            body: await marked.parse(section.body || '')
        }))
    );

    return {
        heading: data.heading,
        body: bodyHtml,
        sections
    };
}
