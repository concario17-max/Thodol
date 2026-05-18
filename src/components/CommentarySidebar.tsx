import { CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpenText, MessageSquare } from 'lucide-react';
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

const getCommentarySource = (chapterNum: string): Record<string, CommentaryBlock[]> | null =>
    chapterNum === '1'
        ? chapter1Commentary
        : chapterNum === '2'
            ? chapter2Commentary
            : chapterNum === '3'
                ? chapter3Commentary
                : chapterNum === '4'
                    ? chapter4Commentary
                    : null;

const renderComicBulletItem = (item: string, index: number) => {
    const bullet = renderBulletItem(item);

    return (
        <li key={`${item}-${index}`} className="flex gap-3 rounded-2xl border border-slate-900/15 bg-white/80 px-3 py-2 shadow-[3px_3px_0_rgba(15,23,42,0.16)] dark:border-slate-100/15 dark:bg-slate-950/60">
            <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
                {bullet.marker}
            </span>
            <span className="min-w-0 flex-1 break-words text-[13px] leading-6 text-slate-800 dark:text-slate-100">{bullet.text}</span>
        </li>
    );
};

const renderComicBlock = (block: CommentaryBlock, index: number) => {
    const leadParagraph = block.paragraphs?.[0] ?? null;
    const extraParagraphs = block.paragraphs?.slice(1) ?? [];
    const panelLabel = `Panel ${String(index + 1).padStart(2, '0')}`;

    return (
        <article
            key={`${block.title}-${index}`}
            className={`relative overflow-hidden rounded-[28px] border-2 border-slate-900/75 bg-[#fffdf7] p-4 text-slate-900 shadow-[6px_6px_0_rgba(15,23,42,0.9)] dark:border-slate-100/20 dark:bg-slate-950/90 dark:text-slate-50 ${
                index % 2 === 0 ? 'ml-0 mr-5' : 'ml-5 mr-0'
            }`}
        >
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full border border-slate-900/70 bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-slate-900 dark:border-slate-100/15 dark:bg-amber-200 dark:text-slate-950">
                    {panelLabel}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                    Adapted from commentary
                </span>
            </div>

            <h3 className="font-display text-[15px] font-semibold leading-snug tracking-[0.01em] text-slate-950 dark:text-slate-50 sm:text-[16px]">
                {block.title}
            </h3>

            {leadParagraph ? (
                <div className="mt-3 rounded-[22px] border-2 border-slate-900/70 bg-sky-100/90 px-4 py-3 shadow-[4px_4px_0_rgba(15,23,42,0.75)] dark:border-slate-100/20 dark:bg-sky-950/50">
                    <p className="text-[13px] leading-7 text-slate-900 dark:text-slate-50">{leadParagraph}</p>
                </div>
            ) : null}

            {extraParagraphs.length > 0 ? (
                <div className="mt-3 space-y-3">
                    {extraParagraphs.map((paragraph, paragraphIndex) => (
                        <p
                            key={`${block.title}-comic-p-${paragraphIndex}`}
                            className="rounded-2xl border border-slate-900/15 bg-white/80 px-3 py-2 text-[13px] leading-7 text-slate-800 shadow-[3px_3px_0_rgba(15,23,42,0.12)] dark:border-slate-100/15 dark:bg-slate-950/60 dark:text-slate-100"
                        >
                            {paragraph}
                        </p>
                    ))}
                </div>
            ) : null}

            {block.table ? (
                <div className="mt-3 rounded-[22px] border-2 border-dashed border-amber-700/50 bg-amber-50/85 p-3 shadow-[4px_4px_0_rgba(180,83,9,0.15)] dark:border-amber-300/35 dark:bg-amber-950/25">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-800 dark:text-amber-200">Reference board</span>
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-700/80 dark:text-amber-200/70">
                            Same data, remixed
                        </span>
                    </div>
                    {renderTable(block.table)}
                </div>
            ) : null}

            {block.bullets ? (
                <ul className="mt-3 space-y-2">
                    {block.bullets.map((item, index) => renderComicBulletItem(item, index))}
                </ul>
            ) : null}
        </article>
    );
};

const renderComicEmptyState = () => (
    <div className="rounded-[28px] border-2 border-dashed border-slate-900/45 bg-[#fffdf7] p-5 text-center text-slate-900 shadow-[6px_6px_0_rgba(15,23,42,0.7)] dark:border-slate-100/20 dark:bg-slate-950/90 dark:text-slate-50">
        <p className="text-[10px] font-black uppercase tracking-[0.32em] text-amber-700 dark:text-amber-200">No panels</p>
        <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">There are no commentary blocks available for comic mode here yet.</p>
    </div>
);

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const {
        activeRightPanel,
        setActiveRightPanel,
        activeDesktopRightPanel,
        rightPanelContentMode,
        toggleRightPanelContentMode,
    } = useUI();

    if (!chapterNum || !verseNum) {
        return null;
    }

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';
    const commentarySource = getCommentarySource(chapterNum);
    const commentaryKey = chapterNum === '1' || chapterNum === '4' ? `${chapterNum}.${verseNum}` : verseNum;
    const commentaryBlocks = commentarySource?.[commentaryKey] ?? null;
    const inlineHeading = commentaryBlocks?.[0]?.title ?? null;
    const bodyBlocks = commentaryBlocks?.length ? commentaryBlocks.slice(1) : null;
    const hasBodyBlocks = Boolean(bodyBlocks && bodyBlocks.length > 0);

    return (
        <SidebarLayout
            isOpen={isOpen}
            isDesktopOpen={isDesktopOpen}
            onClose={() => setActiveRightPanel(null)}
            title={rightPanelContentMode === 'commentary' ? 'Commentary' : 'Learning comic'}
            position="right"
            widthClass="w-[90vw] max-w-[400px]"
            desktopWidthClass="lg:w-full"
        >
            <div className={`relative flex h-full min-h-0 flex-col p-4 ${rightPanelContentMode === 'comic' ? 'bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_42%),_linear-gradient(180deg,_rgba(255,251,235,0.82),_rgba(255,255,255,0.72))] dark:bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.12),_transparent_42%),_linear-gradient(180deg,_rgba(10,10,10,0.96),_rgba(17,24,39,0.9))]' : ''}`}>
                <div className="mb-4 flex shrink-0 items-start justify-between gap-3 border-b border-gold-border/10 pb-3 dark:border-dark-border/45">
                    <div className="flex min-w-0 items-center gap-2">
                        {rightPanelContentMode === 'commentary' ? (
                            <MessageSquare className="h-5 w-5 shrink-0 text-gold-primary dark:text-gold-light" />
                        ) : (
                            <BookOpenText className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-200" />
                        )}
                        <div className="min-w-0">
                            <p className={`text-[10px] font-semibold uppercase tracking-[0.34em] ${rightPanelContentMode === 'commentary' ? 'text-gold-primary/70 dark:text-gold-light/70' : 'text-amber-800/80 dark:text-amber-200/80'}`}>
                                {rightPanelContentMode === 'commentary' ? 'Commentary' : 'Learning comic'}
                            </p>
                            <p className="mt-1 text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                {rightPanelContentMode === 'commentary' ? 'Verse notes and references' : 'Same notes, reframed as comic panels'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={toggleRightPanelContentMode}
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-border/20 bg-white/80 text-gold-primary shadow-sm transition-colors hover:bg-gold-bg hover:text-gold-primary/80 focus:outline-none focus:ring-2 focus:ring-gold-primary/40 dark:border-dark-border/45 dark:bg-dark-surface/90 dark:text-gold-light dark:hover:bg-dark-surface"
                        aria-label={rightPanelContentMode === 'commentary' ? 'Switch to learning comic view' : 'Switch to commentary view'}
                        title={rightPanelContentMode === 'commentary' ? 'Switch to learning comic view' : 'Switch to commentary view'}
                        aria-pressed={rightPanelContentMode === 'comic'}
                    >
                        {rightPanelContentMode === 'commentary' ? <BookOpenText className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                    </button>
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto">
                    {rightPanelContentMode === 'commentary' ? (
                        <>
                            <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs font-semibold tracking-[0.18em] text-text-secondary/65 dark:text-dark-text-secondary/65">
                                <span>
                                    {chapterNum}.{verseNum}
                                </span>
                                {inlineHeading ? <span className="text-sm font-semibold tracking-normal text-text-primary dark:text-dark-text-primary">{inlineHeading}</span> : null}
                            </div>

                            {hasBodyBlocks ? (
                                <div className="space-y-4">{bodyBlocks?.map(renderBlock)}</div>
                            ) : (
                                <div className="flex h-full items-center justify-center text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/65 dark:text-gold-light/65">
                                            No commentary
                                        </p>
                                        <p>Commentary is not available for this sutra.</p>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-[28px] border-2 border-slate-900/75 bg-slate-900 px-4 py-3 text-slate-50 shadow-[6px_6px_0_rgba(15,23,42,0.8)] dark:border-slate-100/20 dark:bg-slate-950">
                                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-amber-300/90 dark:text-amber-200/90">
                                    Chapter {chapterNum} / Verse {verseNum}
                                </p>
                                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <span className="text-lg font-semibold tracking-[0.02em] text-white">
                                        {inlineHeading ?? 'Learning comic'}
                                    </span>
                                    <span className="text-[11px] uppercase tracking-[0.24em] text-slate-300">
                                        {hasBodyBlocks ? `${bodyBlocks?.length ?? 0} panels` : 'No panels'}
                                    </span>
                                </div>
                                <p className="mt-2 max-w-[34ch] text-sm leading-7 text-slate-200">
                                    Same commentary, rearranged into a learning comic view. The content stays the same; only the presentation changes.
                                </p>
                            </div>

                            {hasBodyBlocks ? (
                                <div className="space-y-4">{bodyBlocks?.map(renderComicBlock)}</div>
                            ) : (
                                renderComicEmptyState()
                            )}
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
