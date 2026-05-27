import { YOGA_CHAPTERS_META } from '../constants';
import { YogaChapter, YogaSutra, WordMeaning, VerseWord } from '../types';

interface RawGitaVerse {
    id: string;
    chapter: number;
    verse: number;
    sanskrit: string;
    iast?: string;
    audio?: string;
    words?: VerseWord[];
    translation_en?: string;
    commentary_en?: string;
    korean_pronunciation?: string;
    translation_ham?: string;
    translation_gil?: string;
    translation_jimong?: string;
    translation_suk?: string;
}

interface RawGitaChapter {
    chapter: number;
    verses: RawGitaVerse[];
}

let cachedData: Record<number, YogaChapter> | null = null;
let pendingRequest: Promise<Record<number, YogaChapter>> | null = null;

const normalizeWordMeanings = (meanings?: VerseWord[]): WordMeaning | undefined => {
    if (!meanings?.length) {
        return undefined;
    }

    return meanings.map(({ s, m }) => ({
        word: s,
        meaning: m,
    }));
};

const normalizeVerse = (item: RawGitaVerse): YogaSutra => ({
    id: item.id,
    chapter: item.chapter,
    verse: item.verse,
    sanskrit: item.sanskrit,
    iast: item.iast,
    pronunciation: item.iast ?? '',
    pronunciation_kr: item.korean_pronunciation ?? '',
    audio: item.audio,
    translation_en: item.translation_en,
    commentary_en: item.commentary_en,
    korean_pronunciation: item.korean_pronunciation,
    translation_ham: item.translation_ham,
    translation_gil: item.translation_gil,
    translation_jimong: item.translation_jimong,
    translation_suk: item.translation_suk,
    '2.english': item.translation_en,
    '3.korean-1': item.translation_gil ?? item.translation_ham ?? item.translation_jimong ?? item.translation_suk,
    '5.bae_jik': item.translation_ham,
    '6.bae_uu': item.translation_suk,
    '8. ox': item.translation_gil,
    '9. ox-en': item.translation_en,
    word_meanings: normalizeWordMeanings(item.words),
    words: item.words,
});

export const resetCache = () => {
    cachedData = null;
    pendingRequest = null;
};

export const fetchYogaData = async (): Promise<Record<number, YogaChapter>> => {
    if (cachedData) {
        return cachedData;
    }

    if (pendingRequest) {
        return pendingRequest;
    }

    pendingRequest = (async () => {
        try {
            const response = await fetch('/gita.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch Gita data: ${response.status}`);
            }

            const rawChapters = (await response.json()) as Record<string, RawGitaChapter>;
            const structuredData: Record<number, YogaChapter> = {};

            Object.values(rawChapters)
                .sort((left, right) => left.chapter - right.chapter)
                .forEach((chapterData) => {
                    const chapterNum = chapterData.chapter;
                    const chapterMeta = YOGA_CHAPTERS_META[chapterNum];
                    const verses = chapterData.verses.map(normalizeVerse).sort((left, right) => {
                        const leftNum = left.verse ?? Number.parseInt(left.id.split('.')[1], 10);
                        const rightNum = right.verse ?? Number.parseInt(right.id.split('.')[1], 10);
                        return leftNum - rightNum;
                    });

                    structuredData[chapterNum] = {
                        chapter: chapterNum,
                        meta: {
                            chapter: chapterNum,
                            name_korean: chapterMeta?.name_korean ?? `제${chapterNum}장`,
                            name_english: chapterMeta?.name_english ?? `Chapter ${chapterNum}`,
                            description: chapterMeta?.description ?? '',
                            sutraCount: verses.length,
                        },
                        sutras: verses,
                    };
                });

            cachedData = structuredData;
            return structuredData;
        } catch (error) {
            console.error('Error fetching Gita data:', error);
            throw error instanceof Error ? error : new Error('Unknown Gita data fetch failure');
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
};
