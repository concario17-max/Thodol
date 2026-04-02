import { CSSProperties } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { SidebarLayout } from './ui/SidebarLayout';
import { chapter1Commentary, type CommentaryBlock } from '../data/chapter1Commentary';
import { chapter2Commentary } from '../data/chapter2Commentary';

type RenderableTable = {
    headers: readonly string[];
    rows: ReadonlyArray<readonly string[] | { label: string; value: string }>;
};

type RenderedBulletItem = {
    marker: string;
    text: string;
};

const isTableRowObject = (row: readonly string[] | { label: string; value: string }): row is { label: string; value: string } =>
    !Array.isArray(row);

const toCells = (row: readonly string[] | { label: string; value: string }) => {
    if (isTableRowObject(row)) {
        return [row.label, row.value];
    }

    return [...row];
};

const renderBulletItem = (item: string): RenderedBulletItem => {
    const match = item.match(/^(\d+)\.\s+(.*)$/);

    if (match) {
        return {
            marker: `${match[1]}.`,
            text: match[2],
        };
    }

    return {
        marker: '\u00b7',
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
        <div className="overflow-hidden rounded-xl border border-gold-border/20 bg-white/75 dark:border-dark-border/50 dark:bg-dark-bg/60">
            <div className="grid border-b border-gold-border/20 bg-gold-surface/40 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:bg-dark-surface/80 dark:text-gold-light" style={gridStyle}>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div key={`${table.headers[index] ?? 'header'}-${index}`} className={`px-3 py-2 ${index > 0 ? 'border-l border-gold-border/20 dark:border-dark-border/50' : ''}`}>
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
                                className={`px-3 py-3 text-sm leading-relaxed ${cellIndex > 0 ? 'border-l border-gold-border/10 dark:border-dark-border/40' : ''} ${cellIndex === 0 ? 'font-medium text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}
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
    <section key={block.title} className="space-y-3 rounded-2xl border border-gold-border/20 bg-white/65 p-4 dark:border-dark-border/50 dark:bg-dark-surface/55">
        <h3 className="text-sm font-semibold text-[#1C2B36] dark:text-dark-text-primary">{block.title}</h3>

        {block.paragraphs?.map((paragraph, index) => (
            <p key={`${block.title}-p-${index}`} className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {paragraph}
            </p>
        ))}

        {block.table ? renderTable(block.table) : null}

        {block.bullets ? (
            <ul className="space-y-2 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {block.bullets.map((item, index) => {
                    const bullet = renderBulletItem(item);

                    return (
                        <li key={`${block.title}-b-${index}`} className="flex rounded-xl border border-gold-border/20 bg-white/60 px-3 py-2.5 dark:bg-dark-surface/60">
                            <span className="mr-2 shrink-0 font-semibold text-[#1C2B36] dark:text-dark-text-primary">{bullet.marker}</span>
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
        chapterNum === '1' ? chapter1Commentary : chapterNum === '2' ? chapter2Commentary : null;
    const commentaryKey = chapterNum === '1' ? `${chapterNum}.${verseNum}` : verseNum;
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
            <div className="relative flex h-full min-h-0 flex-col p-6">
                <div className="mb-6 flex shrink-0 items-center gap-2 border-b border-gold-border/30 pb-4">
                    <MessageSquare className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                    <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                </div>

                <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs font-bold tracking-wider text-[#8FA0AD]">
                    <span>{chapterNum}.{verseNum}</span>
                    {inlineHeading ? (
                        <span className="text-sm font-semibold tracking-normal text-[#1C2B36] dark:text-dark-text-primary">
                            {inlineHeading}
                        </span>
                    ) : null}
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto rounded-2xl border border-gold-primary/20 bg-white/70 p-5 shadow-inner backdrop-blur-sm transition-all dark:border-dark-border/60 dark:bg-dark-bg/60">
                    {bodyBlocks && bodyBlocks.length > 0 ? (
                        <div className="space-y-6">{bodyBlocks.map(renderBlock)}</div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-center text-sm text-text-secondary dark:text-dark-text-secondary">
                            <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">내용 없음</p>
                                <p>아직 코멘터리 원고가 준비되지 않았습니다.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
