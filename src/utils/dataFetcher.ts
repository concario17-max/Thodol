import { YOGA_CHAPTERS_META } from '../constants';
import { YogaChapter, YogaSutra, WordMeaning } from '../types';

interface RawSutra {
    id: string;
    sanskrit: string;
    pronunciation: string;
    pronunciation_kr?: string;
    '4.han bal'?: string;
    word_meanings?: Record<string, string>;
    [key: string]: unknown;
}

let cachedData: Record<number, YogaChapter> | null = null;
let pendingRequest: Promise<Record<number, YogaChapter>> | null = null;

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
            const response = await fetch('/data.json');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const rawSutras: RawSutra[] = await response.json();
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

                let normalizedMeanings: WordMeaning | undefined;
                if (item.word_meanings && typeof item.word_meanings === 'object') {
                    normalizedMeanings = Object.entries(item.word_meanings).map(([word, meaning]) => ({
                        word,
                        meaning: meaning as string,
                    }));
                }

                const sutra: YogaSutra = {
                    ...item,
                    pronunciation_kr: item['4.han bal'] || item.pronunciation_kr || '',
                    word_meanings: normalizedMeanings,
                } as YogaSutra;

                structuredData[chapterNum].sutras.push(sutra);
            });

            Object.values(structuredData).forEach((chapter) => {
                chapter.sutras.sort((a, b) => {
                    const aNum = parseInt(a.id.split('.')[1], 10);
                    const bNum = parseInt(b.id.split('.')[1], 10);
                    return aNum - bNum;
                });
                chapter.meta.sutraCount = chapter.sutras.length;
            });

            cachedData = structuredData;
            return structuredData;
        } catch (error) {
            console.error('Error fetching yoga data:', error);
            return {};
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
};
