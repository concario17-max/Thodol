import { YogaChapter, YogaSutra, WordMeaning } from '../types';

interface RawSutra {
    id: string;
    sanskrit: string;
    pronunciation: string;
    pronunciation_kr?: string;
    '4.han bal'?: string;
    word_meanings?: Record<string, string>;
    [key: string]: any; // Allow other language fields
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
        // Use the canonical generated dataset shared with the project scripts.
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const rawSutras: RawSutra[] = await response.json();
        const structuredData: Record<number, YogaChapter> = {};

        rawSutras.forEach(item => {
            const parts = item.id.split('.');
            const chapterNum = parseInt(parts[0], 10);
            
            if (!structuredData[chapterNum]) {
                structuredData[chapterNum] = {
                    chapter: chapterNum,
                    meta: {
                        chapter: chapterNum,
                        name_korean: getChapterName(chapterNum),
                        name_english: getChapterNameEn(chapterNum),
                        description: "",
                        sutraCount: 0
                    },
                    sutras: []
                };
            }

            // Normalize word_meanings: Object -> Array to preserve order and handle duplicates
            let normalizedMeanings: WordMeaning | undefined = undefined;
            if (item.word_meanings && typeof item.word_meanings === 'object') {
                normalizedMeanings = Object.entries(item.word_meanings).map(([word, meaning]) => ({
                    word,
                    meaning: meaning as string
                }));
            }

            const sutra: YogaSutra = {
                ...item,
                pronunciation_kr: item['4.han bal'] || item.pronunciation_kr || "",
                word_meanings: normalizedMeanings
            };
            
            structuredData[chapterNum].sutras.push(sutra);
        });

        // Sort sutras within each chapter and update metadata
        Object.values(structuredData).forEach(chap => {
            chap.sutras.sort((a, b) => {
                const aNum = parseInt(a.id.split('.')[1], 10);
                const bNum = parseInt(b.id.split('.')[1], 10);
                return aNum - bNum;
            });
            chap.meta.sutraCount = chap.sutras.length;
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
        1: "사마디 파다 (Samādhi Pāda)",
        2: "사다나 파다 (Sādhana Pāda)",
        3: "비부티 파다 (Vibhūti Pāda)",
        4: "카이발야 파다 (Kaivalya Pāda)"
    };
    return names[num] || `제 ${num} 장`;
};

const getChapterNameEn = (num: number): string => {
    const names: Record<number, string> = {
        1: "Chapter of Samādhi",
        2: "Chapter of Practice",
        3: "Chapter of Powers",
        4: "Chapter of Liberation"
    };
    return names[num] || `Chapter ${num}`;
};
