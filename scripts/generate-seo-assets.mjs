import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const projectRoot = process.cwd();
const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://yoga-sutras.example.com').replace(/\/+$/, '');

const dataPath = resolve(projectRoot, 'public', 'data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf8').replace(/^\uFEFF/, ''));

if (!Array.isArray(data)) {
    throw new Error('public/data.json must contain an array of sutra entries.');
}

const routes = new Set(['/']);

for (const entry of data) {
    if (!entry?.id || typeof entry.id !== 'string') {
        continue;
    }

    const [chapterNum, verseNum] = entry.id.split('.');
    if (!chapterNum || !verseNum) {
        continue;
    }

    routes.add(`/chapter/${chapterNum}/verse/${verseNum}`);
}

const sortedRoutes = Array.from(routes).sort((left, right) => {
    if (left === '/') {
        return -1;
    }

    if (right === '/') {
        return 1;
    }

    return left.localeCompare(right, 'en', { numeric: true });
});

const urlEntries = sortedRoutes
    .map((route) => {
        const priority = route === '/' ? '1.0' : '0.8';
        const changefreq = route === '/' ? 'daily' : 'weekly';

        return `  <url>\n    <loc>${siteUrl}${route}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;

writeFileSync(resolve(projectRoot, 'public', 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(projectRoot, 'public', 'robots.txt'), robots, 'utf8');
