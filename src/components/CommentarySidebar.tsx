import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpenText, NotebookPen } from 'lucide-react';
import { useYogaData } from '../hooks/useYogaData';
import { chapter1Commentary, type CommentaryBlock } from '../data/chapter1Commentary';
import { chapter2Commentary } from '../data/chapter2Commentary';
import { chapter3Commentary } from '../data/chapter3Commentary';
import { chapter4Commentary } from '../data/chapter4Commentary';

type RenderableTable = {
    headers: readonly string[];
    rows: ReadonlyArray<readonly string[] | { label: string; value: string }>;
};

type CommentaryMode = 'commentary' | 'comic';

const RIGHT_PANEL_MODE_STORAGE_KEY = 'yoga-desktop-right-panel';

type VerseData = {
    sanskrit: string;
    pronunciation: string;
    pronunciation_kr?: string;
    '2.english'?: string;
    '3.korean-1'?: string;
};

type ComicPanel = {
    title: string;
    label: string;
    body: string;
};

const isTableRowObject = (row: readonly string[] | { label: string; value: string }): row is { label: string; value: string } => !Array.isArray(row);

const toCells = (row: readonly string[] | { label: string; value: string }) => (isTableRowObject(row) ? [row.label, row.value] : [...row]);

const truncateText = (text: string, maxLength: number) => {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) {
        return normalized;
    }

    return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}...`;
};

const renderBulletItem = (item: string) => {
    const match = item.match(/^(\d+)\.\s+(.*)$/);

    if (match) {
        return {
            marker: `${match[1]}.`,
            text: match[2],
        };
    }

    return {
        marker: '-',
        text: item,
    };
};

const renderTable = (table: RenderableTable) => {
    const rowCellCount = table.rows.reduce((max, row) => Math.max(max, toCells(row).length), 0);
    const columnCount = Math.max(table.headers.length, rowCellCount, 1);
    const gridStyle: CSSProperties = {
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    };

    return (
        <div className="overflow-hidden border-y border-gold-border/12 dark:border-dark-border/45">
            <div className="grid border-b border-gold-border/12 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light" style={gridStyle}>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div key={`${table.headers[index] ?? 'header'}-${index}`} className={`px-3 py-2 ${index > 0 ? 'border-l border-gold-border/12 dark:border-dark-border/45' : ''}`}>
                        {table.headers[index] ?? ''}
                    </div>
                ))}
            </div>

            {table.rows.map((row, rowIndex) => {
                const cells = toCells(row);
                const paddedCells = Array.from({ length: columnCount }, (_, index) => cells[index] ?? '');

                return (
                    <div key={`row-${rowIndex}`} className="grid border-b border-gold-border/10 last:border-b-0" style={gridStyle}>
                        {paddedCells.map((cell, cellIndex) => (
                            <div
                                key={`cell-${rowIndex}-${cellIndex}`}
                                className={`px-3 py-3 text-sm leading-relaxed ${
                                    cellIndex > 0 ? 'border-l border-gold-border/10 dark:border-dark-border/40' : ''
                                } ${cellIndex === 0 ? 'font-medium text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

const renderBlock = (block: CommentaryBlock) => (
    <section key={block.title} className="space-y-3 border-l border-gold-border/12 pl-4 dark:border-dark-border/45">
        <h3 className="font-sans text-[13px] font-semibold leading-snug tracking-[0.02em] text-text-primary dark:text-dark-text-primary sm:text-[14px]">
            {block.title}
        </h3>

        {block.paragraphs?.map((paragraph, index) => (
            <p key={`${block.title}-p-${index}`} className="font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                {paragraph}
            </p>
        ))}

        {block.table ? renderTable(block.table) : null}

        {block.bullets ? (
            <ul className="space-y-2 font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                {block.bullets.map((item, index) => {
                    const bullet = renderBulletItem(item);

                    return (
                        <li key={`${block.title}-b-${index}`} className="flex gap-3">
                            <span className="shrink-0 font-semibold text-text-primary dark:text-dark-text-primary">{bullet.marker}</span>
                            <span className="min-w-0 flex-1 break-words">{bullet.text}</span>
                        </li>
                    );
                })}
            </ul>
        ) : null}
    </section>
);

const getCommentarySource = (chapterNum: string): Record<string, CommentaryBlock[]> | null => {
    if (chapterNum === '1') {
        return chapter1Commentary;
    }

    if (chapterNum === '2') {
        return chapter2Commentary;
    }

    if (chapterNum === '3') {
        return chapter3Commentary;
    }

    if (chapterNum === '4') {
        return chapter4Commentary;
    }

    return null;
};

const getCommentaryKey = (chapterNum: string, verseNum: string) => (chapterNum === '1' || chapterNum === '4' ? `${chapterNum}.${verseNum}` : verseNum);

const getStoredCommentaryMode = (): CommentaryMode => {
    if (typeof window === 'undefined') {
        return 'commentary';
    }

    try {
        const storedMode = localStorage.getItem(RIGHT_PANEL_MODE_STORAGE_KEY);
        return storedMode === 'comic' ? 'comic' : 'commentary';
    } catch (error) {
        console.warn('Unable to access localStorage for right-panel mode:', error);
        return 'commentary';
    }
};

const ComicCard = ({ label, title, body }: ComicPanel) => (
    <article className="rounded-[1.35rem] border border-gold-border/12 bg-white/66 p-4 shadow-[0_16px_42px_-34px_rgba(0,0,0,0.48)] backdrop-blur-sm dark:border-white/8 dark:bg-white/5">
        <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-gold-border/12 bg-gold-primary/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.24em] text-gold-primary dark:border-gold-light/20 dark:bg-gold-light/10 dark:text-gold-light">
                {label}
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-gold-border/20 to-transparent dark:from-gold-light/20" />
        </div>

        <h4 className="mt-3 font-display text-[18px] font-semibold leading-snug tracking-[0.03em] text-text-primary dark:text-dark-text-primary">
            {title}
        </h4>
        <p className="mt-2 whitespace-pre-line break-keep font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary">
            {body}
        </p>
    </article>
);

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { getVerseInRange, allChapters } = useYogaData();
    const [surfaceMode, setSurfaceMode] = useState<CommentaryMode>(getStoredCommentaryMode);

    const verseData = chapterNum && verseNum ? (getVerseInRange(chapterNum, verseNum) as VerseData | null) : null;
    const currentChapter = chapterNum && allChapters ? allChapters[Number.parseInt(chapterNum, 10)] : null;
    const commentarySource = chapterNum ? getCommentarySource(chapterNum) : null;
    const commentaryKey = chapterNum && verseNum ? getCommentaryKey(chapterNum, verseNum) : null;
    const commentaryBlocks = commentarySource && commentaryKey ? commentarySource[commentaryKey] ?? null : null;
    const inlineHeading = commentaryBlocks?.[0]?.title ?? null;
    const bodyBlocks = commentaryBlocks?.length ? commentaryBlocks.slice(1) : null;

    const comicPanels: ComicPanel[] = useMemo(() => {
        const firstParagraph = bodyBlocks?.find((block) => block.paragraphs && block.paragraphs.length > 0)?.paragraphs?.[0] ?? null;
        const bulletSummary = bodyBlocks?.find((block) => block.bullets && block.bullets.length > 0)?.bullets?.[0] ?? null;

        return [
            {
                label: 'Frame 1',
                title: verseData?.sanskrit ?? `${chapterNum ?? '0'}.${verseNum ?? '0'}`,
                body: truncateText(verseData?.pronunciation ?? 'No pronunciation is available for this verse.', 160),
            },
            {
                label: 'Frame 2',
                title: verseData?.['2.english'] ? 'What the line says' : 'Commentary cue',
                body: truncateText(
                    verseData?.['2.english'] ?? firstParagraph ?? inlineHeading ?? 'The comic view turns the reading into a short visual summary.',
                    190,
                ),
            },
            {
                label: 'Frame 3',
                title: verseData?.['3.korean-1'] ? 'Practice cue' : 'Takeaway',
                body: truncateText(
                    verseData?.['3.korean-1'] ?? bulletSummary ?? 'Watch the mind, notice the movement, and return to stillness.',
                    190,
                ),
            },
        ];
    }, [bodyBlocks, chapterNum, inlineHeading, verseData, verseNum]);

    useEffect(() => {
        try {
            localStorage.setItem(RIGHT_PANEL_MODE_STORAGE_KEY, surfaceMode);
        } catch (error) {
            console.warn('Unable to persist right-panel mode to localStorage:', error);
        }
    }, [surfaceMode]);

    if (!chapterNum || !verseNum) {
        return null;
    }

    const headerTitle = surfaceMode === 'commentary' ? 'Commentary' : 'Learning Comic';
    const headerSubtitle =
        surfaceMode === 'commentary'
            ? 'Verse notes and references'
            : currentChapter
                ? `${currentChapter.chapter}. ${currentChapter.meta.name_korean}`
                : 'Text-driven comic placeholder';

    return (
        <aside className="hidden h-[100dvh] min-h-0 flex-col border-l border-gold-border/10 bg-shell-commentary text-text-primary lg:flex dark:border-dark-border/45 dark:bg-shell-commentary-dark dark:text-dark-text-primary">
            <div className="flex shrink-0 items-center justify-between border-b border-gold-border/10 px-4 py-4 dark:border-dark-border/45">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-border/12 bg-gold-primary/10 text-gold-primary dark:border-gold-light/20 dark:bg-gold-light/10 dark:text-gold-light">
                        <NotebookPen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">{headerTitle}</p>
                        <p className="mt-1 truncate text-sm font-medium text-text-primary dark:text-dark-text-primary">
                            {chapterNum}.{verseNum}
                            {inlineHeading ? <span className="text-text-secondary dark:text-dark-text-secondary"> · {inlineHeading}</span> : null}
                        </p>
                        <p className="mt-1 truncate text-[11px] uppercase tracking-[0.22em] text-text-secondary/70 dark:text-dark-text-secondary/70">{headerSubtitle}</p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setSurfaceMode((prev) => (prev === 'commentary' ? 'comic' : 'commentary'))}
                    aria-label={surfaceMode === 'commentary' ? 'Switch to Learning Comic' : 'Switch to Commentary'}
                    className="rounded-full p-2 text-text-secondary transition-colors hover:bg-shell-header/80 hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-white/5 dark:hover:text-dark-text-primary"
                >
                    {surfaceMode === 'commentary' ? <BookOpenText className="h-5 w-5" /> : <NotebookPen className="h-5 w-5" />}
                </button>
            </div>

            <div className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4">
                {surfaceMode === 'commentary' ? (
                    <div className="space-y-4">
                        <div className="border-b border-gold-border/10 pb-3 dark:border-dark-border/45">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-gold-primary/70 dark:text-gold-light/70">
                                Commentary
                            </p>
                            <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <span className="font-display text-[20px] font-semibold tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                                    {chapterNum}.{verseNum}
                                </span>
                                {inlineHeading ? <span className="font-sans text-[14px] font-medium text-text-secondary dark:text-dark-text-secondary">{inlineHeading}</span> : null}
                            </div>
                        </div>

                        {bodyBlocks && bodyBlocks.length > 0 ? (
                            <div className="space-y-4">{bodyBlocks.map(renderBlock)}</div>
                        ) : (
                            <div className="flex min-h-[12rem] items-center justify-center rounded-[1.35rem] border border-dashed border-gold-border/20 bg-white/42 px-6 text-center text-sm text-text-secondary dark:border-dark-border/45 dark:bg-white/5 dark:text-dark-text-secondary">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/65 dark:text-gold-light/65">No commentary</p>
                                    <p>Commentary is not available for this sutra.</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="rounded-[1.5rem] border border-gold-border/12 bg-[linear-gradient(180deg,rgba(255,253,248,0.92)_0%,rgba(245,236,223,0.86)_100%)] p-4 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.45)] dark:border-dark-border/45 dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0.02)_100%)]">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">
                                Learning comic
                            </p>
                            <div className="mt-3 space-y-3">
                                <p className="font-display text-[22px] font-semibold leading-tight tracking-[0.05em] text-text-primary dark:text-dark-text-primary">
                                    {verseData?.sanskrit ?? `${chapterNum}.${verseNum}`}
                                </p>
                                {verseData?.pronunciation ? (
                                    <p className="font-serif text-[16px] leading-7 italic text-text-secondary dark:text-dark-text-secondary">
                                        {truncateText(verseData.pronunciation, 180)}
                                    </p>
                                ) : null}
                                <p className="rounded-[1rem] border border-gold-border/10 bg-white/72 px-3 py-2 text-[13px] leading-7 text-text-secondary dark:border-dark-border/45 dark:bg-white/5 dark:text-dark-text-secondary">
                                    {truncateText(
                                        verseData?.['2.english'] ?? inlineHeading ?? 'A compact, text-only comic view that keeps the reading surface in the same right column.',
                                        220,
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {comicPanels.map((panel) => (
                                <ComicCard key={`${panel.label}-${panel.title}`} {...panel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default CommentarySidebar;
