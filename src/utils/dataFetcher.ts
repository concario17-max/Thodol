import { YogaChapter, YogaSutra, WordMeaning, VerseWord, type RuntimeSection } from '../types';
import { chapter1Commentary, type CommentaryBlock as Chapter1CommentaryBlock } from '../data/chapter1Commentary';

interface RawVerseText {
    tibetan?: string;
    english?: string;
    korean?: string | RawKoreanTranslation[];
}

interface RawKoreanTranslation {
    translator?: string;
    text?: string;
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
    translation_joongam?: string;
    translation_ryu?: string;
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

const APPENDIX_CHAPTER_NAME_KOREAN = '중간계와 관련된 예비 기도';
const APPENDIX_CHAPTER_NAME_ENGLISH = 'Preliminary Prayers Related to the Intermediate State';

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

const extractKoreanTranslation = (item: RawVerse): string => {
    const explicitKorean = item.translation_ham?.trim();
    if (explicitKorean) {
        return explicitKorean;
    }

    const rawKorean = item.text?.korean;
    if (typeof rawKorean === 'string') {
        return rawKorean.trim();
    }

    if (Array.isArray(rawKorean)) {
        const preferredTranslation = rawKorean.find((entry) => entry.translator?.trim() === '정창영') ?? rawKorean[0];
        return preferredTranslation?.text?.trim() ?? '';
    }

    return '';
};

const extractKoreanTranslationByTranslator = (item: RawVerse, translatorName: string): string => {
    const rawKorean = item.text?.korean;

    if (!Array.isArray(rawKorean)) {
        return '';
    }

    const matchedTranslation = rawKorean.find((entry) => entry.translator?.trim() === translatorName.trim());
    return matchedTranslation?.text?.trim() ?? '';
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

const escapeCommentaryCell = (value: string) => value.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');

const serializeCommentaryTable = (table: NonNullable<Chapter1CommentaryBlock['table']>) => {
    const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 1);
    const headers = Array.from({ length: columnCount }, (_, index) => escapeCommentaryCell(table.headers[index] ?? ''));
    const separator = Array.from({ length: columnCount }, () => '---');
    const rows = table.rows.map((row) =>
        Array.from({ length: columnCount }, (_, index) => escapeCommentaryCell(row[index] ?? '')),
    );

    return [`| ${headers.join(' | ')} |`, `| ${separator.join(' | ')} |`, ...rows.map((row) => `| ${row.join(' | ')} |`)].join('\n');
};

const serializeCommentaryBlocks = (blocks?: Chapter1CommentaryBlock[]) => {
    if (!blocks?.length) {
        return null;
    }

    return blocks
        .flatMap((block) => {
            const parts: string[] = [];

            if (block.title?.trim()) {
                parts.push(`# ${block.title.trim()}`);
            }

            if (block.paragraphs?.length) {
                parts.push(block.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean).join('\n\n'));
            }

            if (block.bullets?.length) {
                parts.push(block.bullets.map((bullet) => `- ${bullet.trim()}`).join('\n'));
            }

            if (block.table) {
                parts.push(serializeCommentaryTable(block.table));
            }

            return parts.filter(Boolean);
        })
        .join('\n\n')
        .trim();
};

const chapter1CommentaryKeys = Object.keys(chapter1Commentary) as Array<keyof typeof chapter1Commentary>;
const chapter1CommentaryFallbackKey = chapter1CommentaryKeys[chapter1CommentaryKeys.length - 1];
const chapter1CommentaryFallbackBlocks = chapter1Commentary[chapter1CommentaryFallbackKey];

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
    const korean = extractKoreanTranslation(item);
    const koreanJoongam = extractKoreanTranslationByTranslator(item, '중암 선혜');
    const koreanRyu = extractKoreanTranslationByTranslator(item, '류시화');
    const tibetan = sourceText.tibetan ?? '';
    const pronunciation = title || chapterTitle || english || korean;
    const commentaryBody = chapterTitle || english || korean;
    const commentaryHeading = title || sourceSectionName || `${chapterNumber}.${verseNumber}`;
    const chapter1CommentaryKey = `${chapterNumber}.${verseNumber}` as keyof typeof chapter1Commentary;
    const chapter1CommentaryText =
        chapterNumber === 1
            ? serializeCommentaryBlocks(chapter1Commentary[chapter1CommentaryKey] ?? chapter1CommentaryFallbackBlocks)
            : null;

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
        commentary_en: chapter1CommentaryText ?? buildCommentary(commentaryHeading, commentaryBody),
        korean_pronunciation: item.korean_pronunciation ?? (korean || undefined),
        translation_ham: korean || undefined,
        translation_gil: item.translation_gil ?? (english || undefined),
        translation_jimong: item.translation_jimong ?? (chapterTitle || undefined),
        translation_suk: item.translation_suk ?? (korean || undefined),
        translation_joongam: item.translation_joongam ?? (koreanJoongam || undefined),
        translation_ryu: item.translation_ryu ?? (koreanRyu || undefined),
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
