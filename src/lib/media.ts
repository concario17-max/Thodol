export type LearningComicChapter = '1' | '2' | '3' | '4';

export interface LearningComicDimensions {
    width: number;
    height: number;
}

const LEARNING_COMIC_DIMENSIONS: Record<LearningComicChapter, LearningComicDimensions> = {
    1: { width: 1055, height: 1491 },
    2: { width: 1024, height: 1536 },
    3: { width: 1024, height: 1536 },
    4: { width: 1024, height: 1536 },
};

export const getLearningComicDimensions = (chapterNum: string): LearningComicDimensions => {
    if (chapterNum === '1' || chapterNum === '2' || chapterNum === '3' || chapterNum === '4') {
        return LEARNING_COMIC_DIMENSIONS[chapterNum];
    }

    return { width: 1024, height: 1536 };
};
