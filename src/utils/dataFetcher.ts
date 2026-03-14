import { YogaChapter, YogaSutra } from '../types';
import { YOGA_CHAPTERS_META } from '../constants';

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
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const sutras: unknown = await response.json();
        
        if (!Array.isArray(sutras)) {
            throw new Error('Invalid data format: Expected an array of sutras');
        }

        const structuredData: Record<number, YogaChapter> = {};

        // Group by chapter with integrity check
        sutras.forEach(item => {
            const sutra = item as YogaSutra;
            if (!sutra.id || typeof sutra.id !== 'string') return;

            const parts = sutra.id.split('.');
            if (parts.length < 2) return;

            const chapterNum = parseInt(parts[0], 10);
            if (isNaN(chapterNum)) return;

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
        return {};
    }
};
