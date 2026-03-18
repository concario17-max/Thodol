import { YogaChapter } from '../types';

export interface SutraTarget {
    chapter: number;
    verse: string;
}

export const getPreviousSutraTarget = (
    allChapters: Record<number, YogaChapter> | null,
    chapterNum: string | undefined,
    currentIndex: number,
): SutraTarget | null => {
    if (!allChapters || !chapterNum) {
        return null;
    }

    const currentChapterNumber = parseInt(chapterNum, 10);
    const currentChapter = allChapters[currentChapterNumber];
    if (!currentChapter) {
        return null;
    }

    if (currentIndex > 0) {
        return {
            chapter: currentChapterNumber,
            verse: currentChapter.sutras[currentIndex - 1].id.split('.')[1],
        };
    }

    if (currentChapterNumber > 1) {
        const previousChapter = allChapters[currentChapterNumber - 1];
        if (previousChapter?.sutras.length) {
            return {
                chapter: currentChapterNumber - 1,
                verse: previousChapter.sutras[previousChapter.sutras.length - 1].id.split('.')[1],
            };
        }
    }

    return null;
};

export const getNextSutraTarget = (
    allChapters: Record<number, YogaChapter> | null,
    chapterNum: string | undefined,
    currentIndex: number,
): SutraTarget | null => {
    if (!allChapters || !chapterNum) {
        return null;
    }

    const currentChapterNumber = parseInt(chapterNum, 10);
    const currentChapter = allChapters[currentChapterNumber];
    if (!currentChapter) {
        return null;
    }

    if (currentIndex < currentChapter.sutras.length - 1) {
        return {
            chapter: currentChapterNumber,
            verse: currentChapter.sutras[currentIndex + 1].id.split('.')[1],
        };
    }

    if (currentChapterNumber < Object.keys(allChapters).length) {
        const nextChapter = allChapters[currentChapterNumber + 1];
        if (nextChapter?.sutras.length) {
            return {
                chapter: currentChapterNumber + 1,
                verse: nextChapter.sutras[0].id.split('.')[1],
            };
        }
    }

    return null;
};
