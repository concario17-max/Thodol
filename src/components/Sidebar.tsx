import { useParams } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useYogaData } from '../hooks/useYogaData';
import { SidebarLayout } from './ui/SidebarLayout';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const { allChapters, loading, getVerseInRange } = useYogaData();

    const chapterNumber = chapterNum ? parseInt(chapterNum, 10) : null;
    const currentChapter = chapterNumber ? allChapters?.[chapterNumber] ?? null : null;
    const verseData = chapterNum && verseNum ? getVerseInRange(chapterNum, verseNum) : null;
    const chapterMeta = currentChapter ? String(currentChapter.chapter).padStart(2, '0') : '00';
    const verseMeta = verseNum ? String(parseInt(verseNum, 10)).padStart(2, '0') : '00';

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
                <div className="mx-auto flex w-full max-w-[320px] flex-1 flex-col gap-6">
                    <div className="relative overflow-hidden border-b border-gold-border/20 pb-4 dark:border-dark-border/25">
                        <span className="absolute left-0 top-0 h-full w-[3px] rounded-full bg-gradient-to-b from-gold-primary via-gold-primary/70 to-transparent shadow-[0_0_18px_rgba(166,139,92,0.45)] dark:from-gold-light dark:via-gold-light/70" />
                        <div className="pl-5">
                            <div className="flex items-baseline gap-2">
                                <p className="font-inter text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-primary/70 dark:text-gold-light/75">
                                    Chapter
                                </p>
                                <p className="font-display text-[28px] font-semibold leading-none tracking-[0.12em] text-text-primary dark:text-dark-text-primary">
                                    {chapterMeta}
                                </p>
                            </div>
                            <div className="mt-3 flex items-center gap-3">
                                <span className="h-px w-8 bg-gold-primary/45 dark:bg-gold-light/45" />
                                <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.34em] text-text-secondary/55 dark:text-dark-text-secondary/55">
                                    Sutra
                                </p>
                                <p className="font-display text-[18px] font-medium leading-none tracking-[0.18em] text-gold-primary/90 dark:text-gold-light/90">
                                    {verseMeta}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section className="relative pl-4">
                            <span className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-[2px] rounded-full bg-gold-primary/45 dark:bg-gold-light/45" />
                            <p className="whitespace-pre-line break-keep font-display text-[17px] leading-[1.95] tracking-[0.02em] text-gold-primary/90 dark:text-gold-light/90 sm:text-[18px]">
                                {verseData.sanskrit}
                            </p>
                        </section>

                        <div className="h-px bg-gradient-to-r from-gold-border/30 via-gold-border/12 to-transparent dark:from-dark-border/30 dark:via-dark-border/12" />

                        <section className="relative pl-4">
                            <span className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-[2px] rounded-full bg-text-secondary/35 dark:bg-dark-text-secondary/35" />
                            <p className="whitespace-pre-line break-keep font-serif text-[15px] leading-[1.9] tracking-[0.01em] text-text-primary/90 dark:text-dark-text-primary/90 sm:text-[16px]">
                                {verseData['2.english'] ?? ''}
                            </p>
                        </section>

                        <div className="h-px bg-gradient-to-r from-gold-border/30 via-gold-border/12 to-transparent dark:from-dark-border/30 dark:via-dark-border/12" />

                        <section className="relative pl-4">
                            <span className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-[2px] rounded-full bg-text-primary/25 dark:bg-dark-text-primary/25" />
                            <p className="whitespace-pre-line break-keep font-pretendard text-[14px] leading-[1.95] tracking-[0.005em] text-text-secondary/90 dark:text-dark-text-secondary/90 sm:text-[15px]">
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
