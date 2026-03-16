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

export const resetCache = () => {
    cachedData = null;
};

export const fetchYogaData = async (): Promise<Record<number, YogaChapter>> => {
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const rawSutras: RawSutra[] = await response.json();
        const structuredData: Record<number, YogaChapter> = {};

        rawSutras.forEach((item) => {
            const chapterNum = parseInt(item.id.split('.')[0], 10);

            if (!structuredData[chapterNum]) {
                structuredData[chapterNum] = {
                    chapter: chapterNum,
                    meta: {
                        chapter: chapterNum,
                        name_korean: getChapterName(chapterNum),
                        name_english: getChapterNameEn(chapterNum),
                        description: '',
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
    }
};

const getChapterName = (num: number): string => {
    const names: Record<number, string> = {
        1: '삼매 파다 (Samadhi Pada)',
        2: '사다나 파다 (Sadhana Pada)',
        3: '비부티 파다 (Vibhuti Pada)',
        4: '카이발야 파다 (Kaivalya Pada)',
    };

    return names[num] || `챕터 ${num}`;
};

const getChapterNameEn = (num: number): string => {
    const names: Record<number, string> = {
        1: 'Chapter of Samadhi',
        2: 'Chapter of Practice',
        3: 'Chapter of Powers',
        4: 'Chapter of Liberation',
    };

    return names[num] || `Chapter ${num}`;
};
