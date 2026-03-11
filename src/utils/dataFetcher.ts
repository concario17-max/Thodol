import { YogaChapter, YogaSutra } from '../types';
import { YOGA_CHAPTERS_META } from '../constants';

let cachedData: Record<number, YogaChapter> | null = null;

export const fetchYogaData = async (): Promise<Record<number, YogaChapter>> => {
    if (cachedData) {
        return cachedData;
    }

    try {
        const response = await fetch('/data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sutras: YogaSutra[] = await response.json();

        const structuredData: Record<number, YogaChapter> = {};

        // Group by chapter
        sutras.forEach(sutra => {
            const [chapterStr] = sutra.id.split('.');
            const chapterNum = parseInt(chapterStr, 10);

            if (!structuredData[chapterNum]) {
                const meta = YOGA_CHAPTERS_META[chapterNum] || {
                    chapter: chapterNum,
                    name_korean: `Chapter ${chapterNum}`,
                    name_english: `Chapter ${chapterNum}`,
                    description: '',
                    sutraCount: 0
                };
                structuredData[chapterNum] = {
                    chapter: chapterNum,
                    meta,
                    sutras: []
                };
            }
            structuredData[chapterNum].sutras.push(sutra);
        });

        // Ensure sutras are sorted by sutra number
        Object.values(structuredData).forEach(chap => {
            chap.sutras.sort((a, b) => {
                const [, aSutra] = a.id.split('.');
                const [, bSutra] = b.id.split('.');
                return parseInt(aSutra, 10) - parseInt(bSutra, 10);
            });
        });

        cachedData = structuredData;
        return structuredData;
    } catch (error) {
        console.error("Failed to fetch Yoga data:", error);
        return {};
    }
};
