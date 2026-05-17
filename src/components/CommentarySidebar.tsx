import { CSSProperties, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpenText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { SidebarLayout } from './ui/SidebarLayout';
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

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel, setActiveDesktopRightPanel } = useUI();
    const [isLearningComicView, setIsLearningComicView] = useState(false);

    if (!chapterNum || !verseNum) {
        return null;
    }

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';
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
    const closeCommentaryPanel = () => {
        setActiveRightPanel(null);
        setActiveDesktopRightPanel(null);
    };

    return (
        <SidebarLayout
            isOpen={isOpen}
            isDesktopOpen={isDesktopOpen}
            onClose={closeCommentaryPanel}
            title="Commentary"
            position="right"
            widthClass="w-[90vw] max-w-[400px]"
            desktopWidthClass="lg:w-full"
        >
            <div className="relative flex h-full min-h-0 flex-col p-3 sm:p-4">
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-gold-border/10 bg-shell-main/78 shadow-[0_22px_52px_-38px_rgba(120,93,42,0.6)] backdrop-blur-sm dark:border-dark-border/38 dark:bg-shell-main-dark/78">
                    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-gold-border/10 px-4 py-3 dark:border-dark-border/45">
                        <div aria-hidden="true" />

                        <div className="min-w-0 justify-self-center text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/75 dark:text-gold-light/75">
                                Commentary
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label={'\ud559\uc2b5\ub9cc\ud654'}
                            aria-pressed={isLearningComicView}
                            onClick={() => setIsLearningComicView((prev) => !prev)}
                            className={`inline-flex justify-self-end shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] shadow-[0_8px_20px_-14px_rgba(166,139,92,0.85)] transition-colors ${
                                isLearningComicView
                                    ? 'border-gold-primary/40 bg-gold-primary text-white dark:border-gold-light/40 dark:bg-gold-light dark:text-[#2a2116]'
                                    : 'border-gold-border/14 bg-gold-surface/80 text-gold-primary hover:bg-gold-surface/95 dark:border-dark-border/50 dark:bg-white/5 dark:text-gold-light dark:hover:bg-white/8'
                            }`}
                        >
                            <BookOpenText className="h-3.5 w-3.5 shrink-0" />
                            <span>{'\ud559\uc2b5\ub9cc\ud654'}</span>
                        </button>
                    </div>

                    <div className="border-b border-gold-border/8 px-4 py-3 dark:border-dark-border/35">
                        <div className="mx-auto flex w-full max-w-[34rem] flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="font-display text-[18px] font-semibold tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                                {chapterNum}.{verseNum}
                            </span>
                            {inlineHeading ? (
                                <span className="font-sans text-[13px] font-medium text-text-secondary dark:text-dark-text-secondary">
                                    {inlineHeading}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                        <div className="mx-auto w-full max-w-[34rem] space-y-4">
                            {isLearningComicView ? (
                                <div className="rounded-[18px] border border-gold-border/12 bg-gold-surface/45 px-4 py-4 text-sm leading-7 text-text-secondary shadow-[0_10px_30px_-24px_rgba(120,93,42,0.45)] dark:border-dark-border/35 dark:bg-white/5 dark:text-dark-text-secondary">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">
                                        \ud559\uc2b5\ub9cc\ud654
                                    </p>
                                    <p className="mt-2">
                                        ???? ?? ???. ??? ??? ????, ???? ????? ?? ?? ??? ???.
                                    </p>
                                </div>
                            ) : null}

                            {bodyBlocks && bodyBlocks.length > 0 ? (
                                <div className="space-y-4">{bodyBlocks.map(renderBlock)}</div>
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-[18px] border border-dashed border-gold-border/12 text-center text-sm text-text-secondary dark:border-dark-border/35 dark:text-dark-text-secondary">
                                    <div className="space-y-2 px-6 py-10">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/65 dark:text-gold-light/65">
                                            No commentary
                                        </p>
                                        <p>Commentary is not available for this sutra.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
