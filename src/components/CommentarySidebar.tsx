import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { SidebarLayout } from './ui/SidebarLayout';
import { chapter1Commentary, type Chapter1CommentaryVerseKey, type CommentaryBlock } from '../data/chapter1Commentary';

const isChapter1CommentaryVerseKey = (key: string): key is Chapter1CommentaryVerseKey =>
    Object.prototype.hasOwnProperty.call(chapter1Commentary, key);

const renderBlock = (block: CommentaryBlock) => (
    <section key={block.title} className="space-y-3 rounded-2xl border border-gold-border/20 bg-white/65 p-4 dark:border-dark-border/50 dark:bg-dark-surface/55">
        <h3 className="text-sm font-semibold text-[#1C2B36] dark:text-dark-text-primary">{block.title}</h3>

        {block.paragraphs?.map((paragraph) => (
            <p key={paragraph} className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {paragraph}
            </p>
        ))}

        {block.table ? (
            <div className="overflow-hidden rounded-xl border border-gold-border/20 bg-white/75 dark:border-dark-border/50 dark:bg-dark-bg/60">
                <div className="grid grid-cols-2 border-b border-gold-border/20 bg-gold-surface/40 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:bg-dark-surface/80 dark:text-gold-light">
                    <div className="px-3 py-2">{block.table.headers[0]}</div>
                    <div className="border-l border-gold-border/20 px-3 py-2 dark:border-dark-border/50">{block.table.headers[1]}</div>
                </div>

                {block.table.rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-2 border-b border-gold-border/10 last:border-b-0">
                        <div className="px-3 py-3 text-sm font-medium text-text-primary dark:text-dark-text-primary">{row.label}</div>
                        <div className="border-l border-gold-border/10 px-3 py-3 text-sm leading-relaxed text-text-secondary dark:border-dark-border/40 dark:text-dark-text-secondary">
                            {row.value}
                        </div>
                    </div>
                ))}
            </div>
        ) : null}

        {block.bullets ? (
            <ul className="space-y-2 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {block.bullets.map((item) => (
                    <li key={item} className="rounded-xl border border-gold-border/20 bg-white/60 px-3 py-2.5 dark:bg-dark-surface/60">
                        · {item}
                    </li>
                ))}
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
    const verseKey = `${chapterNum}.${verseNum}`;
    const commentaryBlocks =
        chapterNum === '1' && isChapter1CommentaryVerseKey(verseKey) ? chapter1Commentary[verseKey] : null;

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

                <div className="mb-2 text-xs font-bold tracking-wider text-[#8FA0AD]">
                    {chapterNum}.{verseNum}
                </div>

                <div className="custom-scrollbar flex-1 overflow-y-auto rounded-2xl border border-gold-primary/20 bg-white/70 p-5 shadow-inner backdrop-blur-sm transition-all dark:border-dark-border/60 dark:bg-dark-bg/60">
                    {commentaryBlocks && commentaryBlocks.length > 0 ? (
                        <div className="space-y-6">{commentaryBlocks.map(renderBlock)}</div>
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
