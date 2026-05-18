import { CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { SquareArrowOutUpRight } from 'lucide-react';
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
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel } = useUI();

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

    return (
        <SidebarLayout
            isOpen={isOpen}
            isDesktopOpen={isDesktopOpen}
            onClose={() => setActiveRightPanel(null)}
            title="Commentary"
            position="right"
            widthClass="w-[90vw] max-w-[400px]"
            desktopWidthClass="lg:w-full"
        >
            <div className="relative flex h-full min-h-0 flex-col p-4">
                <div className="mb-4 flex shrink-0 items-center gap-3 border-b border-gold-border/10 pb-3 dark:border-dark-border/45">
                    <span className="inline-flex items-center rounded-full bg-gold-soft/90 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:bg-gold-soft/20 dark:text-gold-light">
                        Commentary
                    </span>
                    <span className="h-px flex-1 bg-gradient-to-r from-gold-border/55 via-gold-border/18 to-transparent dark:from-dark-border/60 dark:via-dark-border/20" />
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-border/50 bg-shell-main/80 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] dark:border-dark-border/60 dark:bg-dark-surface/80 dark:text-gold-light">
                        <SquareArrowOutUpRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                </div>

                <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs font-semibold tracking-[0.18em] text-text-secondary/65 dark:text-dark-text-secondary/65">
                    <span>
                        {chapterNum}.{verseNum}
                    </span>
                    {inlineHeading ? <span className="text-sm font-semibold tracking-normal text-text-primary dark:text-dark-text-primary">{inlineHeading}</span> : null}
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto">
                    {bodyBlocks && bodyBlocks.length > 0 ? (
                        <div className="space-y-4">{bodyBlocks.map(renderBlock)}</div>
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
                </div>
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
