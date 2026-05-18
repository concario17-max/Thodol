import { CSSProperties, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Image as ImageIcon } from 'lucide-react';
import { chapter1Commentary, type CommentaryBlock } from '../data/chapter1Commentary';
import { chapter2Commentary } from '../data/chapter2Commentary';
import { chapter3Commentary } from '../data/chapter3Commentary';
import { chapter4Commentary } from '../data/chapter4Commentary';

type RenderableTable = {
    headers: readonly string[];
    rows: ReadonlyArray<readonly string[] | { label: string; value: string }>;
};

const isTableRowObject = (row: readonly string[] | { label: string; value: string }): row is { label: string; value: string } => !Array.isArray(row);

const toCells = (row: readonly string[] | { label: string; value: string }) => (isTableRowObject(row) ? [row.label, row.value] : [...row]);

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

const renderComicPanel = (block: CommentaryBlock, index: number) => {
    const previewText = block.paragraphs?.[0] ?? block.bullets?.[0] ?? ' ';

    return (
        <article
            key={block.title}
            className="overflow-hidden rounded-2xl border border-gold-border/12 bg-gradient-to-br from-shell-main/95 via-shell-main/90 to-shell-commentary/80 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.42)] dark:border-dark-border/45 dark:from-shell-main-dark/95 dark:via-shell-main-dark/92 dark:to-shell-commentary-dark/80"
        >
            <div className="flex items-center justify-between border-b border-gold-border/10 px-4 py-3 dark:border-dark-border/40">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-gold-primary/65 dark:text-gold-light/65">
                        Panel {index + 1}
                    </p>
                    <h3 className="mt-1 truncate font-sans text-[14px] font-semibold leading-snug text-text-primary dark:text-dark-text-primary">
                        {block.title}
                    </h3>
                </div>
                <div className="h-9 w-9 shrink-0 rounded-full border border-gold-border/12 bg-shell-main/80 text-center text-[10px] font-semibold leading-9 text-gold-primary dark:border-dark-border/40 dark:bg-shell-main-dark/80 dark:text-gold-light">
                    {index + 1}
                </div>
            </div>

            <div className="space-y-3 px-4 py-4">
                <p className="font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                    {previewText}
                </p>

                {block.paragraphs && block.paragraphs.length > 1 ? (
                    <div className="rounded-xl border border-dashed border-gold-border/12 bg-shell-main/55 p-3 dark:border-dark-border/35 dark:bg-shell-main-dark/50">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-primary/70 dark:text-gold-light/70">
                            More detail
                        </p>
                        <div className="mt-2 space-y-2">
                            {block.paragraphs.slice(1).map((paragraph, paragraphIndex) => (
                                <p
                                    key={`${block.title}-comic-p-${paragraphIndex}`}
                                    className="font-sans text-[13px] leading-6 text-text-secondary/90 dark:text-dark-text-secondary/90"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                ) : null}

                {block.bullets ? (
                    <div className="flex flex-wrap gap-2">
                        {block.bullets.map((item, bulletIndex) => {
                            const bullet = renderBulletItem(item);

                            return (
                                <span
                                    key={`${block.title}-comic-b-${bulletIndex}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-gold-border/10 bg-shell-main/70 px-3 py-1 text-[12px] leading-5 text-text-secondary dark:border-dark-border/35 dark:bg-shell-main-dark/70 dark:text-dark-text-secondary"
                                >
                                    <span className="font-semibold text-text-primary dark:text-dark-text-primary">{bullet.marker}</span>
                                    <span className="truncate">{bullet.text}</span>
                                </span>
                            );
                        })}
                    </div>
                ) : null}
            </div>
        </article>
    );
};

export type VerseContentMode = 'commentary' | 'comic';

interface VerseContentColumnProps {
    chapterNum: string;
    verseNum: string;
    contentMode: VerseContentMode;
    onContentModeChange: (mode: VerseContentMode) => void;
    className?: string;
}

export const VerseContentColumn = ({
    chapterNum,
    verseNum,
    contentMode,
    onContentModeChange,
    className = '',
}: VerseContentColumnProps) => {
    const commentarySource: Record<string, CommentaryBlock[]> | null =
        chapterNum === '1'
            ? chapter1Commentary
            : chapterNum === '2'
                ? chapter2Commentary
                : chapterNum === '3'
                    ? chapter3Commentary
                    : chapterNum === '4'
                        ? chapter4Commentary
                        : null;
    const commentaryKey = chapterNum === '1' || chapterNum === '4' ? `${chapterNum}.${verseNum}` : verseNum;
    const commentaryBlocks = commentarySource?.[commentaryKey] ?? null;
    const inlineHeading = commentaryBlocks?.[0]?.title ?? null;
    const bodyBlocks = commentaryBlocks?.length ? commentaryBlocks.slice(1) : null;
    const hasCommentaryBody = Boolean(bodyBlocks?.length);
    const isComicMode = contentMode === 'comic';

    return (
        <section className={`w-full space-y-4 rounded-[1.5rem] border border-gold-border/12 bg-shell-commentary px-4 py-4 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.42)] dark:border-dark-border/45 dark:bg-shell-commentary-dark ${className}`}>
            <div className="border-b border-gold-border/10 pb-3 dark:border-dark-border/45">
                <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-gold-primary/70 dark:text-gold-light/70">
                    Verse content
                </p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <span className="font-display text-[20px] font-semibold tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                        {chapterNum}.{verseNum}
                    </span>
                    {inlineHeading ? <span className="font-sans text-[14px] font-medium text-text-secondary dark:text-dark-text-secondary">{inlineHeading}</span> : null}
                </div>
            </div>

            <div
                className="inline-flex shrink-0 overflow-hidden rounded-full border border-gold-border/12 bg-shell-main/80 p-1 shadow-[0_10px_28px_-24px_rgba(0,0,0,0.55)] dark:border-dark-border/45 dark:bg-shell-main-dark/80"
                role="tablist"
                aria-label="Verse content mode"
            >
                <button
                    type="button"
                    role="tab"
                    aria-selected={!isComicMode}
                    aria-label="Show commentary"
                    title="Commentary"
                    onClick={() => onContentModeChange('commentary')}
                    className={`rounded-full p-2 transition-all duration-200 ${
                        !isComicMode
                            ? 'bg-gold-primary text-shell-main shadow-[0_8px_24px_-18px_rgba(167,120,0,0.9)] dark:bg-gold-light dark:text-shell-main-dark'
                            : 'text-text-secondary hover:bg-gold-border/8 hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-white/5 dark:hover:text-dark-text-primary'
                    }`}
                >
                    <BookOpen className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={isComicMode}
                    aria-label="Show learning comic"
                    title="Learning comic"
                    onClick={() => onContentModeChange('comic')}
                    className={`rounded-full p-2 transition-all duration-200 ${
                        isComicMode
                            ? 'bg-gold-primary text-shell-main shadow-[0_8px_24px_-18px_rgba(167,120,0,0.9)] dark:bg-gold-light dark:text-shell-main-dark'
                            : 'text-text-secondary hover:bg-gold-border/8 hover:text-text-primary dark:text-dark-text-secondary dark:hover:bg-white/5 dark:hover:text-dark-text-primary'
                    }`}
                >
                    <ImageIcon className="h-4 w-4" />
                </button>
            </div>

            <div className="space-y-3">
                {commentaryBlocks && commentaryBlocks.length > 0 ? (
                    isComicMode ? (
                        <div className="space-y-3">
                            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-primary/70 dark:text-gold-light/70">
                                <span className="h-px flex-1 bg-gold-border/10 dark:bg-dark-border/45" />
                                <span>Learning comic</span>
                                <span className="h-px flex-1 bg-gold-border/10 dark:bg-dark-border/45" />
                            </div>
                            <div className="space-y-3">{commentaryBlocks.map(renderComicPanel)}</div>
                        </div>
                    ) : hasCommentaryBody ? (
                        <div className="space-y-4">{bodyBlocks!.map(renderBlock)}</div>
                    ) : (
                        <div className="flex min-h-[10rem] items-center justify-center text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                            <div className="space-y-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/65 dark:text-gold-light/65">
                                    No commentary
                                </p>
                                <p>Commentary is not available for this sutra.</p>
                            </div>
                        </div>
                    )
                ) : (
                    <div className="flex min-h-[10rem] items-center justify-center text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/65 dark:text-gold-light/65">
                                No content
                            </p>
                            <p>Verse content is not available for this sutra.</p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const [contentMode, setContentMode] = useState<'commentary' | 'comic'>(() => {
        if (typeof window === 'undefined') {
            return 'commentary';
        }

        const storedMode = window.localStorage.getItem('commentary-sidebar-content-mode');

        return storedMode === 'comic' ? 'comic' : 'commentary';
    });

    useEffect(() => {
        window.localStorage.setItem('commentary-sidebar-content-mode', contentMode);
    }, [contentMode]);

    if (!chapterNum || !verseNum) {
        return null;
    }

    return <VerseContentColumn chapterNum={chapterNum} verseNum={verseNum} contentMode={contentMode} onContentModeChange={setContentMode} />;
};

export default CommentarySidebar;
