import { useEffect } from 'react';
import { createCanonicalUrl, createPageTitle, DARK_THEME_COLOR, LIGHT_THEME_COLOR, SITE_DESCRIPTION, SITE_LOCALE, SITE_NAME, SITE_OG_IMAGE } from '../lib/site';

interface SeoProps {
    title?: string;
    description?: string;
    canonicalPath?: string;
    image?: string;
    type?: 'website' | 'article';
    noIndex?: boolean;
}

const ensureMeta = (attribute: 'name' | 'property', key: string) => {
    const selector = `meta[${attribute}="${key}"]`;
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }

    return element;
};

const ensureLink = (rel: string) => {
    const selector = `link[rel="${rel}"]`;
    let element = document.head.querySelector(selector) as HTMLLinkElement | null;

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
    }

    return element;
};

export const Seo = ({
    title,
    description = SITE_DESCRIPTION,
    canonicalPath = '/',
    image = SITE_OG_IMAGE,
    type = 'website',
    noIndex = false,
}: SeoProps) => {
    useEffect(() => {
        const pageTitle = createPageTitle(title);
        const canonicalUrl = createCanonicalUrl(canonicalPath);
        const imageUrl = createCanonicalUrl(image);
        const isDarkTheme = document.documentElement.classList.contains('dark');
        const themeColor = isDarkTheme ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;

        document.title = pageTitle;
        document.documentElement.lang = SITE_LOCALE.slice(0, 2);

        ensureMeta('name', 'description').setAttribute('content', description);
        ensureMeta('name', 'theme-color').setAttribute('content', themeColor);
        ensureMeta('name', 'color-scheme').setAttribute('content', 'light dark');
        ensureMeta('name', 'robots').setAttribute('content', noIndex ? 'noindex,nofollow' : 'index,follow');

        ensureMeta('property', 'og:site_name').setAttribute('content', SITE_NAME);
        ensureMeta('property', 'og:title').setAttribute('content', pageTitle);
        ensureMeta('property', 'og:description').setAttribute('content', description);
        ensureMeta('property', 'og:type').setAttribute('content', type);
        ensureMeta('property', 'og:url').setAttribute('content', canonicalUrl);
        ensureMeta('property', 'og:image').setAttribute('content', imageUrl);
        ensureMeta('property', 'og:locale').setAttribute('content', SITE_LOCALE);
        ensureMeta('name', 'twitter:card').setAttribute('content', 'summary_large_image');
        ensureMeta('name', 'twitter:title').setAttribute('content', pageTitle);
        ensureMeta('name', 'twitter:description').setAttribute('content', description);
        ensureMeta('name', 'twitter:image').setAttribute('content', imageUrl);

        ensureLink('canonical').setAttribute('href', canonicalUrl);
    }, [canonicalPath, description, image, noIndex, title, type]);

    return null;
};
