import { useState, useEffect, useCallback } from 'react';
import { fetchYogaData } from '../utils/dataFetcher';
import { YogaChapter, YogaSutra } from '../types';

export const useYogaData = () => {
    const [allChapters, setAllChapters] = useState<Record<number, YogaChapter> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchYogaData()
            .then(data => {
                setAllChapters(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    const getVerseInRange = useCallback((chapterNum: string, verseNum: string): YogaSutra | null => {
        if (!allChapters) return null;
        const chapter = allChapters[parseInt(chapterNum, 10)];
        if (!chapter) return null;

        const targetVerseNum = parseInt(verseNum, 10);
        const verseIndex = chapter.sutras.findIndex((s, i, arr) => {
            const sutraNum = parseInt(s.id.split('.')[1], 10);
            const nextS = arr[i + 1];
            if (nextS) {
                const nextNum = parseInt(nextS.id.split('.')[1], 10);
                return sutraNum <= targetVerseNum && targetVerseNum < nextNum;
            }
            return sutraNum <= targetVerseNum;
        });

        return verseIndex !== -1 ? chapter.sutras[verseIndex] : null;
    }, [allChapters]);

    const getVerseRangeText = useCallback((chapter: YogaChapter, sutra: YogaSutra): string => {
        const idx = chapter.sutras.findIndex((s: YogaSutra) => s.id === sutra.id);
        const nextS = chapter.sutras[idx + 1];
        const currentNum = parseInt(sutra.id.split('.')[1], 10);
        if (nextS) {
            const nextNum = parseInt(nextS.id.split('.')[1], 10);
            if (nextNum > currentNum + 1) {
                return `${currentNum}-${nextNum - 1}`;
            }
        }
        return currentNum.toString();
    }, []);

    return {
        allChapters,
        loading,
        getVerseInRange,
        getVerseRangeText
    };
};
