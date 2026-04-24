import { useParams } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useYogaData } from '../hooks/useYogaData';
import { SidebarLayout } from './ui/SidebarLayout';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const { allChapters, loading, getVerseInRange, getVerseRangeLabel } = useYogaData();

    const chapterNumber = chapterNum ? parseInt(chapterNum, 10) : null;
    const currentChapter = chapterNumber ? allChapters?.[chapterNumber] ?? null : null;
    const verseData = chapterNum && verseNum ? getVerseInRange(chapterNum, verseNum) : null;

    if (loading || !currentChapter || !verseData) {
        return (
            <SidebarLayout
                isOpen={isSidebarOpen}
                isDesktopOpen={isDesktopSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                title="읽기 카드"
                position="left"
                widthClass="w-[88vw] max-w-[360px]"
                desktopWidthClass="lg:w-[360px]"
                desktopMinWidthClass="lg:min-w-[340px]"
            >
                <div className="flex h-full items-center justify-center px-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
                </div>
            </SidebarLayout>
        );
    }

    const verseRange = getVerseRangeLabel(currentChapter, verseData);

    return (
        <SidebarLayout
            isOpen={isSidebarOpen}
            isDesktopOpen={isDesktopSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            title="읽기 카드"
            position="left"
            widthClass="w-[88vw] max-w-[360px]"
            desktopWidthClass="lg:w-[360px]"
            desktopMinWidthClass="lg:min-w-[340px]"
        >
            <div className="custom-scrollbar flex h-full flex-col overflow-y-auto px-3 py-4">
                <div className="mx-auto flex w-full max-w-[320px] flex-1 flex-col gap-5">
                    <div className="space-y-1 border-b border-gold-border/25 pb-3 dark:border-dark-border/30">
                        <p className="font-inter text-[11px] uppercase tracking-[0.24em] text-text-secondary/80 dark:text-dark-text-secondary/80">
                            Chapter {currentChapter.chapter}
                        </p>
                        <p className="font-display text-lg font-semibold leading-snug text-text-primary dark:text-dark-text-primary">
                            Sutra {verseRange}
                        </p>
                    </div>

                    <div className="space-y-5">
                        <section className="space-y-2">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-primary/80 dark:text-gold-light/80">Sanskrit</h3>
                            <p className="whitespace-pre-line break-keep font-sans text-sm leading-relaxed text-text-primary dark:text-dark-text-primary sm:text-[15px]">{verseData.sanskrit}</p>
                        </section>

                        <div className="h-px bg-gold-border/20 dark:bg-dark-border/40" />

                        <section className="space-y-2">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-primary/80 dark:text-gold-light/80">English</h3>
                            <p className="whitespace-pre-line break-keep font-sans text-sm leading-relaxed text-text-primary dark:text-dark-text-primary sm:text-[15px]">
                                {verseData['2.english'] ?? ''}
                            </p>
                        </section>

                        <div className="h-px bg-gold-border/20 dark:bg-dark-border/40" />

                        <section className="space-y-2">
                            <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-primary/80 dark:text-gold-light/80">Korean</h3>
                            <p className="whitespace-pre-line break-keep font-sans text-sm leading-relaxed text-text-primary dark:text-dark-text-primary sm:text-[15px]">
                                {verseData['3.korean-1'] ?? ''}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default Sidebar;
