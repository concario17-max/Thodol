import { YogaChapter, YogaSutra, WordMeaning, VerseWord, type RuntimeSection } from '../types';

interface RawVerseText {
    tibetan?: string;
    english?: string;
    korean?: string;
}

interface RawVerse {
    id: string;
    title?: string;
    chapterTitle?: string;
    text?: RawVerseText;
    audio?: string;
    audioUrl?: string;
    words?: VerseWord[];
    translation_en?: string;
    commentary_en?: string;
    korean_pronunciation?: string;
    translation_ham?: string;
    translation_gil?: string;
    translation_jimong?: string;
    translation_suk?: string;
}

interface RawPrayerSection {
    id: string;
    chapterName: string;
    verses: RawVerse[];
}

interface RawBookSubchapter {
    id: string;
    chapterName: string;
    verses: RawVerse[];
}

interface RawBookSection {
    id: string;
    chapterName: string;
    subchapters: RawBookSubchapter[];
}

type RawPrayerFile = RawPrayerSection[];
type RawBookFile = RawBookSection[];

const APPENDIX_CHAPTER_NAME_KOREAN = '\uBD80\uB85D:\uAE30\uB3C4\uBB38';
const APPENDIX_CHAPTER_NAME_ENGLISH = 'Appendix: Prayers';

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

const buildCommentary = (heading: string, body: string) => {
    const trimmedHeading = heading.trim();
    const trimmedBody = body.trim();

    if (!trimmedHeading && !trimmedBody) {
        return undefined;
    }

    if (!trimmedBody) {
        return `# ${trimmedHeading}`;
    }

    return trimmedHeading ? `# ${trimmedHeading}\n\n${trimmedBody}` : trimmedBody;
};

const normalizeVerse = (
    item: RawVerse,
    chapterNumber: number,
    verseNumber: number,
    sourceSectionId: string,
    sourceSectionName: string,
    sourceKind: 'prayer' | 'book',
): YogaSutra => {
    const title = item.title?.trim() ?? '';
    const chapterTitle = item.chapterTitle?.trim() ?? '';
    const sourceText = item.text ?? {};
    const english = item.translation_en ?? sourceText.english ?? '';
    const korean = item.translation_ham ?? sourceText.korean ?? '';
    const tibetan = sourceText.tibetan ?? '';
    const pronunciation = title || chapterTitle || english || korean;
    const commentaryBody = chapterTitle || english || korean;
    const commentaryHeading = title || sourceSectionName || `${chapterNumber}.${verseNumber}`;

    return {
        id: `${chapterNumber}.${verseNumber}`,
        chapter: chapterNumber,
        verse: verseNumber,
        sanskrit: tibetan || title || chapterTitle || english || korean,
        iast: pronunciation,
        pronunciation,
        pronunciation_kr: korean,
        displayTitle: title || chapterTitle || english || korean || tibetan,
        displaySubtitle: chapterTitle || english || korean || title || tibetan,
        bodyText: english || korean || tibetan || chapterTitle || title || '',
        sectionLabel: sourceKind === 'prayer' ? APPENDIX_CHAPTER_NAME_KOREAN : '본문',
        sourceKind,
        audio: item.audioUrl ?? item.audio,
        audioUrl: item.audioUrl ?? item.audio,
        translation_en: english || undefined,
        commentary_en: buildCommentary(commentaryHeading, commentaryBody),
        korean_pronunciation: item.korean_pronunciation ?? (korean || undefined),
        translation_ham: korean || undefined,
        translation_gil: item.translation_gil ?? (english || undefined),
        translation_jimong: item.translation_jimong ?? (chapterTitle || undefined),
        translation_suk: item.translation_suk ?? (korean || undefined),
        '2.english': english || undefined,
        '3.korean-1': korean || undefined,
        '5.bae_jik': korean || undefined,
        '6.bae_uu': item.translation_suk ?? (korean || undefined),
        '8. ox': item.translation_gil ?? (english || undefined),
        '9. ox-en': english || undefined,
        text: sourceText,
        title,
        chapterTitle,
        sourceId: item.id,
        sourceSectionId,
        sourceChapterName: sourceSectionName,
        word_meanings: normalizeWordMeanings(item.words),
        words: item.words,
    };
};

const buildChapter = (
    chapterNumber: number,
    nameKorean: string,
    nameEnglish: string,
    description: string,
    sourceId: string,
    sourceType: 'appendix' | 'book',
    sectionLabel: string,
    sections: RawBookSubchapter[] | RawPrayerSection[],
): YogaChapter => {
    let verseNumber = 1;
    const runtimeSections: RuntimeSection[] = [];
    const sutras: YogaSutra[] = [];

    sections.forEach((section) => {
        const normalizedVerses = section.verses.map((verse) => {
            const normalized = normalizeVerse(
                verse,
                chapterNumber,
                verseNumber,
                section.id,
                section.chapterName,
                sourceType === 'appendix' ? 'prayer' : 'book',
            );
            verseNumber += 1;
            sutras.push(normalized);
            return normalized;
        });

        runtimeSections.push({
            id: section.id,
            chapterName: section.chapterName,
            verses: normalizedVerses,
        });
    });

    return {
        chapter: chapterNumber,
        meta: {
            chapter: chapterNumber,
            name_korean: nameKorean,
            name_english: nameEnglish,
            description,
            sutraCount: sutras.length,
            sectionLabel,
        },
        sutras,
        sections: runtimeSections,
        sourceId,
        sourceType,
    };
};

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
            const [prayersResponse, bookResponse] = await Promise.all([
                fetch('/prayers.json'),
                fetch('/book.json'),
            ]);

            if (!prayersResponse.ok) {
                throw new Error(`Failed to fetch prayers data: ${prayersResponse.status}`);
            }

            if (!bookResponse.ok) {
                throw new Error(`Failed to fetch book data: ${bookResponse.status}`);
            }

            const prayers = (await prayersResponse.json()) as RawPrayerFile;
            const book = (await bookResponse.json()) as RawBookFile;

            const structuredData: Record<number, YogaChapter> = {};
            let chapterNumber = 1;

            structuredData[chapterNumber] = buildChapter(
                chapterNumber,
                APPENDIX_CHAPTER_NAME_KOREAN,
                APPENDIX_CHAPTER_NAME_ENGLISH,
                'Appendix prayers',
                'prayers',
                'appendix',
                APPENDIX_CHAPTER_NAME_KOREAN,
                prayers,
            );
            chapterNumber += 1;

            book.forEach((group, index) => {
                const currentChapter = chapterNumber + index;
                structuredData[currentChapter] = buildChapter(
                    currentChapter,
                    group.chapterName,
                    group.chapterName,
                    group.chapterName,
                    group.id,
                    'book',
                    '본문',
                    group.subchapters,
                );
            });

            cachedData = structuredData;
            return structuredData;
        } catch (error) {
            console.error('Error fetching merged book/prayers data:', error);
            throw error instanceof Error ? error : new Error('Unknown merged data fetch failure');
        } finally {
            pendingRequest = null;
        }
    })();

    return pendingRequest;
};
