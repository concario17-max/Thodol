import { X, MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useParams } from 'react-router-dom';

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { 
        activeRightPanel, 
        setActiveRightPanel, 
        activeDesktopRightPanel,
        isDesktopSidebarOpen
    } = useUI();

    if (!chapterNum || !verseNum) return null;

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';

    // 좌측(Chapter)이 닫혀있으면 폭을 720px로 동적 확장 (400 + 320)
    const desktopWidthClass = isDesktopSidebarOpen ? 'lg:w-[400px]' : 'lg:w-[720px]';

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setActiveRightPanel(null)}
                />
            )}
            <aside className={`fixed inset-y-0 right-0 z-50 sm:w-[400px] bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border-l border-gold-primary/20 dark:border-dark-border/50 h-[100dvh] lg:h-[calc(100vh-64px)] lg:sticky lg:top-16 transform transition-all duration-300 flex flex-col font-inter
                ${isOpen ? 'w-[90vw] translate-x-0 overflow-hidden shadow-2xl lg:shadow-none' : 'w-[90vw] translate-x-full lg:translate-x-0'}
                ${isDesktopOpen ? `${desktopWidthClass} lg:opacity-100` : 'lg:w-0 lg:opacity-0 lg:border-none lg:translate-x-10 px-0 overflow-hidden'}
            `}>

                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button onClick={() => setActiveRightPanel(null)} className="p-2 rounded-full hover:bg-gold-surface dark:hover:bg-dark-surface text-text-secondary dark:text-dark-text-secondary transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 relative flex flex-col h-full min-h-0">
                    <div className="flex items-center gap-2 mb-6 shrink-0 border-b border-gold-border/30 pb-4">
                        <MessageSquare className="w-5 h-5 text-[#A68B5C] dark:text-gold-light" />
                        <h2 className="text-sm font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide">코멘터리 (Commentary)</h2>
                    </div>

                    <div className="mb-4 flex-1 flex flex-col min-h-0 space-y-2">
                        <div className="text-xs font-bold text-[#8FA0AD] tracking-wider mb-2">
                            {chapterNum}.{verseNum}
                        </div>

                        <div className="flex-1 w-full p-5 rounded-2xl border border-gold-primary/20 dark:border-dark-border/60 bg-white/70 dark:bg-dark-bg/60 text-text-primary dark:text-dark-text-primary shadow-inner backdrop-blur-sm transition-all font-sans text-base leading-loose custom-scrollbar overflow-y-auto">
                            <p className="opacity-50 text-center mt-10">이곳에 코멘터리가 표시될 예정입니다.</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default CommentarySidebar;
