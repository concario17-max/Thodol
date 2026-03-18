import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';
import { YOGA_CHAPTERS_META } from '../constants';
import { useUI } from '../context/UIContext';
import { useYogaData } from '../hooks/useYogaData';

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel, isDesktopSidebarOpen } = useUI();
    const { getVerseInRange } = useYogaData();

    if (!chapterNum || !verseNum) {
        return null;
    }

    const verse = getVerseInRange(chapterNum, verseNum);
    const chapter = YOGA_CHAPTERS_META[parseInt(chapterNum, 10)];
    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';
    const desktopWidthClass = isDesktopSidebarOpen ? 'lg:w-[400px]' : 'lg:w-[720px]';

    const prompts = useMemo(() => {
        if (!verse) {
            return [];
        }

        return [
            '이 구절이 마음의 어떤 움직임을 관찰하거나 멈추려 하는지 본다.',
            '번역마다 강조점이 어떻게 달라지는지 비교한다.',
            '단어 풀이에서 반복되는 핵심 개념을 본문과 연결한다.',
        ];
    }, [verse]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
                    onClick={() => setActiveRightPanel(null)}
                />
            )}

            <aside
                className={`fixed bottom-0 right-0 top-16 z-50 flex h-[calc(100dvh-64px)] flex-col border-l border-gold-primary/20 bg-white/40 font-inter backdrop-blur-md transition-all duration-300 dark:border-dark-border/50 dark:bg-dark-surface/40 sm:w-[400px] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)]
                ${isOpen ? 'w-[90vw] translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'w-[90vw] translate-x-full lg:translate-x-0'}
                ${isDesktopOpen ? `${desktopWidthClass} lg:opacity-100` : 'overflow-hidden px-0 lg:w-0 lg:translate-x-10 lg:border-none lg:opacity-0'}`}
            >
                <div className="absolute right-4 top-4 z-50 lg:hidden">
                    <button
                        type="button"
                        onClick={() => setActiveRightPanel(null)}
                        className="rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative flex h-full min-h-0 flex-col p-6">
                    <div className="mb-6 flex shrink-0 items-center gap-2 border-b border-gold-border/30 pb-4">
                        <MessageSquare className="h-5 w-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">해설 가이드 (Commentary)</h2>
                    </div>

                    <div className="mb-2 text-xs font-bold tracking-wider text-[#8FA0AD]">{chapterNum}.{verseNum}</div>

                    <div className="custom-scrollbar flex-1 overflow-y-auto rounded-2xl border border-gold-primary/20 bg-white/70 p-5 shadow-inner backdrop-blur-sm transition-all dark:border-dark-border/60 dark:bg-dark-bg/60">
                        <div className="space-y-5 text-sm leading-7 text-text-primary dark:text-dark-text-primary">
                            <section>
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-primary">Chapter Focus</h3>
                                <p className="break-keep">{chapter ? `${chapter.name_english} · ${chapter.name_korean}` : `Chapter ${chapterNum}`}</p>
                                <p className="mt-2 break-keep text-text-secondary dark:text-dark-text-secondary">
                                    {chapter?.description || '현재 장의 주제를 기준으로 구절을 해석해 보세요.'}
                                </p>
                            </section>

                            <section>
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-primary">Verse Lens</h3>
                                <p className="break-keep text-text-secondary dark:text-dark-text-secondary">
                                    {verse?.['2.english'] || verse?.['3.korean-1'] || '이 구절의 핵심 문장을 번역 섹션과 함께 비교해 보세요.'}
                                </p>
                            </section>

                            <section>
                                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-primary">Study Prompts</h3>
                                <ul className="space-y-2 text-text-secondary dark:text-dark-text-secondary">
                                    {prompts.map((prompt) => (
                                        <li key={prompt} className="break-keep">
                                            {prompt}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default CommentarySidebar;
