import { useParams } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';
import { useUI } from '../context/UIContext';

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel, isDesktopSidebarOpen } = useUI();

    if (!chapterNum || !verseNum) {
        return null;
    }

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';
    const desktopWidthClass = isDesktopSidebarOpen ? 'lg:w-[400px]' : 'lg:w-[720px]';

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
                        <h2 className="text-sm font-bold tracking-wide text-[#1C2B36] dark:text-dark-text-primary">Commentary</h2>
                    </div>

                    <div className="mb-2 text-xs font-bold tracking-wider text-[#8FA0AD]">{chapterNum}.{verseNum}</div>

                    <div className="custom-scrollbar flex-1 overflow-y-auto rounded-2xl border border-gold-primary/20 bg-white/70 p-5 shadow-inner backdrop-blur-sm transition-all dark:border-dark-border/60 dark:bg-dark-bg/60" />
                </div>
            </aside>
        </>
    );
};

export default CommentarySidebar;
