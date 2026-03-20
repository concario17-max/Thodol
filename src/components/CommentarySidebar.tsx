import { useParams } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { SidebarLayout } from './ui/SidebarLayout';

const CommentarySidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { activeRightPanel, setActiveRightPanel, activeDesktopRightPanel } = useUI();

    if (!chapterNum || !verseNum) {
        return null;
    }

    const isOpen = activeRightPanel === 'commentary';
    const isDesktopOpen = activeDesktopRightPanel === 'commentary';

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

                <div className="mb-2 text-xs font-bold tracking-wider text-[#8FA0AD]">{chapterNum}.{verseNum}</div>

                <div className="custom-scrollbar flex-1 overflow-y-auto rounded-2xl border border-gold-primary/20 bg-white/70 p-5 shadow-inner backdrop-blur-sm transition-all dark:border-dark-border/60 dark:bg-dark-bg/60" />
            </div>
        </SidebarLayout>
    );
};

export default CommentarySidebar;
