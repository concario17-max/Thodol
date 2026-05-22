export const SITE_NAME = 'Yoga Sutras';
export const SITE_TAGLINE = 'A calm, premium reading space for the Yoga Sutras.';
export const SITE_DESCRIPTION =
    'Browse the Yoga Sutras with chapter navigation, Sanskrit, pronunciation, translations, audio, commentary, and study aids in a premium editorial layout.';
export const SITE_OG_IMAGE = '/favicon.png';
export const SITE_LOCALE = 'en_US';
export const LIGHT_THEME_COLOR = '#faf6ef';
export const DARK_THEME_COLOR = '#0e0c0a';

const DEFAULT_FALLBACK_ORIGIN = 'https://yoga-sutras.example.com';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const resolveSiteOrigin = () => {
    const envSiteUrl = import.meta.env.VITE_SITE_URL?.trim();

    if (envSiteUrl) {
        return trimTrailingSlash(envSiteUrl);
    }

    if (typeof window !== 'undefined' && window.location.origin) {
        return trimTrailingSlash(window.location.origin);
    }

    return DEFAULT_FALLBACK_ORIGIN;
};

export const normalizePath = (path: string) => {
    if (!path) {
        return '/';
    }

    return path.startsWith('/') ? path : `/${path}`;
};

export const createCanonicalUrl = (path = '/') => {
    const origin = resolveSiteOrigin();
    return new URL(normalizePath(path), `${origin}/`).toString();
};

export const createPageTitle = (pageTitle?: string | null) => {
    if (!pageTitle) {
        return SITE_NAME;
    }

    return `${pageTitle} | ${SITE_NAME}`;
};
