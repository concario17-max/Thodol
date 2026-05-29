export interface AlbumTrack {
    id: string;
    title: string;
    url: string;
}

export interface AlbumData {
    id: string;
    title: string;
    artist: string;
    description: string;
    coverImage: string;
    tracks: AlbumTrack[];
}

const ALBUMS_SOURCE_URL = '/albums.json';

const normalizeText = (value: unknown, fallback = ''): string => {
    if (typeof value !== 'string') {
        return fallback;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
};

const normalizeAssetPath = (value: string): string => {
    const trimmed = value.trim().replace(/\\/g, '/');

    if (!trimmed) {
        return '';
    }

    const withoutPublicPrefix = trimmed
        .replace(/^\.\/+/, '/')
        .replace(/^\/?public\//, '/')
        .replace(/^public\//, '/');

    return withoutPublicPrefix.startsWith('/') ? withoutPublicPrefix.replace(/\/{2,}/g, '/') : `/${withoutPublicPrefix.replace(/\/{2,}/g, '/')}`;
};

const normalizeTrack = (track: unknown, index: number, albumId: string): AlbumTrack => {
    const trackRecord = (track ?? {}) as Record<string, unknown>;

    return {
        id: normalizeText(trackRecord.id, `${albumId}-track-${index + 1}`),
        title: normalizeText(trackRecord.title, `Track ${index + 1}`),
        url: normalizeAssetPath(normalizeText(trackRecord.url)),
    };
};

const normalizeAlbum = (album: unknown, index: number): AlbumData => {
    const albumRecord = (album ?? {}) as Record<string, unknown>;
    const albumId = normalizeText(albumRecord.id, `album-${String(index + 1).padStart(2, '0')}`);

    return {
        id: albumId,
        title: normalizeText(albumRecord.title, `Album ${index + 1}`),
        artist: normalizeText(albumRecord.artist, 'Unknown artist'),
        description: normalizeText(albumRecord.description, ''),
        coverImage: normalizeAssetPath(normalizeText(albumRecord.coverImage)),
        tracks: Array.isArray(albumRecord.tracks)
            ? albumRecord.tracks.map((track, trackIndex) => normalizeTrack(track, trackIndex, albumId)).filter((track) => track.url.length > 0)
            : [],
    };
};

export const loadAlbums = async (): Promise<AlbumData[]> => {
    const response = await fetch(ALBUMS_SOURCE_URL, { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('앨범 데이터를 불러오지 못했어.');
    }

    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) {
        throw new Error('앨범 데이터 형식이 올바르지 않아.');
    }

    return payload.map((album, index) => normalizeAlbum(album, index));
};

export const ALBUMS_ROUTE_PATH = '/albums';
