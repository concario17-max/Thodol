import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { YOGA_CHAPTERS_META } from '../constants';
import { useUI } from '../context/UIContext';
import { useYogaData } from '../hooks/useYogaData';
import { SidebarLayout } from './ui/SidebarLayout';

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel } = useUI();
    const { getVerseInRange, chapters } = useYogaData();

    if (!chapterNum || !verseNum) {
        return null;
    }

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';
    const chapterNumber = parseInt(chapterNum, 10);
    const verseData = getVerseInRange(chapterNum, verseNum);
    const chapter = chapters.find((entry) => entry.chapter === chapterNumber);
    const chapterMeta = YOGA_CHAPTERS_META[chapterNumber];

    const prompts = useMemo(
        () => [
            '이 구절이 수행자에게 요구하는 실제 태도는 무엇인가?',
            '번역마다 다르게 강조하는 핵심 어휘는 무엇인가?',
            '지금 읽은 내용을 오늘의 삶과 연결하면 어떤 질문이 남는가?',
        ],
        [],
    );

    const keyLine = verseData?.['3.korean-1'] || verseData?.['2.english'] || verseData?.sanskrit || 'This sutra is available for close reading and comparison.';
    const commentarySummary = chapterMeta?.description || chapter?.meta.description || 'This chapter frames the broader context for the sutra you are reading.';

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
                    <div className="space-y-6">
                        <section>
                            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-primary/80 dark:text-gold-light/80">Chapter frame</h3>
                            <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">{commentarySummary}</p>
                        </section>

                        <section>
                            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-primary/80 dark:text-gold-light/80">Key line</h3>
                            <p className="rounded-2xl border border-gold-border/30 bg-white/75 p-4 text-sm leading-relaxed text-text-primary dark:bg-dark-surface/70 dark:text-dark-text-primary">
                                {keyLine}
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-primary/80 dark:text-gold-light/80">Study prompts</h3>
                            <ul className="space-y-2 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                                {prompts.map((prompt) => (
                                    <li key={prompt} className="rounded-xl border border-gold-border/20 bg-white/60 px-3 py-2.5 dark:bg-dark-surface/60">
                                        {prompt}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-primary/80 dark:text-gold-light/80">Use this panel</h3>
                            <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                                Compare the translations, note repeated words, and use the prompts above to turn the sutra from a quoted line into a working question.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
