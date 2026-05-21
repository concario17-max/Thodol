import { YOGA_CHAPTERS_META } from '../constants';
import { YogaChapter, YogaSutra, WordMeaning } from '../types';

interface RawSutra {
    id: string;
    sanskrit: string;
    pronunciation: string;
    pronunciation_kr?: string;
    '2.english'?: string;
    '3.korean-1'?: string;
    '4.han bal'?: string;
    '5.bae_jik'?: string;
    '6.bae_uu'?: string;
    '8. ox'?: string;
    '9. ox-en'?: string;
    word_meanings?: Record<string, string>;
}

let cachedData: Record<number, YogaChapter> | null = null;
let pendingRequest: Promise<Record<number, YogaChapter>> | null = null;

const normalizeWordMeanings = (meanings?: Record<string, string>): WordMeaning | undefined => {
    if (!meanings) {
        return undefined;
    }

    return Object.entries(meanings).map(([word, meaning]) => ({
        word,
        meaning,
    }));
};

const normalizeSutra = (item: RawSutra): YogaSutra => ({
    id: item.id,
    sanskrit: item.sanskrit,
    pronunciation: item.pronunciation,
    pronunciation_kr: item['4.han bal'] || item.pronunciation_kr || '',
    '2.english': item['2.english'],
    '3.korean-1': item['3.korean-1'],
    '5.bae_jik': item['5.bae_jik'],
    '6.bae_uu': item['6.bae_uu'],
    '8. ox': item['8. ox'],
    '9. ox-en': item['9. ox-en'],
    word_meanings: normalizeWordMeanings(item.word_meanings),
});

export const resetCache = () => {
    cachedData = null;
    pendingRequest = null;
};

export const getCachedYogaData = () => cachedData;

export const fetchYogaData = async (): Promise<Record<number, YogaChapter>> => {
    if (cachedData) {
        return cachedData;
    }

    if (pendingRequest) {
        return pendingRequest;
    }

    pendingRequest = (async () => {
        try {
            const response = await fetch('/data.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const rawSutras = (await response.json()) as RawSutra[];
            const structuredData: Record<number, YogaChapter> = {};

            rawSutras.forEach((item) => {
                const chapterNum = parseInt(item.id.split('.')[0], 10);
                const chapterMeta = YOGA_CHAPTERS_META[chapterNum];

                if (!structuredData[chapterNum]) {
                    structuredData[chapterNum] = {
                        chapter: chapterNum,
                        meta: {
                            chapter: chapterNum,
                            name_korean: chapterMeta?.name_korean || `챕터 ${chapterNum}`,
                            name_english: chapterMeta?.name_english || `Chapter ${chapterNum}`,
                            description: chapterMeta?.description || '',
                            sutraCount: 0,
                        },
                        sutras: [],
                    };
                }

                structuredData[chapterNum].sutras.push(normalizeSutra(item));
            });

            Object.values(structuredData).forEach((chapter) => {
                chapter.sutras.sort((left, right) => {
                    const leftNum = parseInt(left.id.split('.')[1], 10);
                    const rightNum = parseInt(right.id.split('.')[1], 10);
                    return leftNum - rightNum;
                });
                chapter.meta.sutraCount = chapter.sutras.length;
            });

            cachedData = structuredData;
            return structuredData;
        } catch (error) {
            console.error('Error fetching yoga data:', error);
            throw error instanceof Error ? error : new Error('Unknown yoga data fetch failure');
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
};
