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
                title="Reading Guide"
                position="left"
                widthClass="w-[88vw] max-w-[360px]"
                desktopWidthClass="lg:w-full"
                desktopMinWidthClass="lg:min-w-[22rem]"
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
            title="Reading Guide"
            position="left"
            widthClass="w-[88vw] max-w-[360px]"
            desktopWidthClass="lg:w-full"
            desktopMinWidthClass="lg:min-w-[22rem]"
        >
            <div className="custom-scrollbar flex h-full min-h-0 flex-col overflow-y-auto px-3 py-4 pb-6">
                <div className="mx-auto flex w-full max-w-[320px] flex-1 flex-col gap-4 sm:gap-5">
                    <div className="rounded-[1.25rem] border border-gold-border/18 bg-white/72 p-4 shadow-[0_18px_40px_-34px_rgba(0,0,0,0.35)] dark:border-dark-border/55 dark:bg-dark-surface/60">
                        <div className="flex items-baseline justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-gold-primary/80 dark:text-gold-light/80">
                                    Chapter
                                </p>
                                <p className="mt-2 font-display text-[30px] font-semibold leading-none tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                                    {chapterMeta}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-text-secondary/65 dark:text-dark-text-secondary/70">
                                    Sutra
                                </p>
                                <p className="mt-2 font-display text-[22px] font-semibold leading-none tracking-[0.12em] text-gold-primary dark:text-gold-light">
                                    {verseMeta}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <section className="rounded-[1.1rem] border border-gold-border/16 bg-white/68 p-4 dark:border-dark-border/50 dark:bg-dark-surface/58">
                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/80 dark:text-gold-light/80">
                                    Sanskrit
                                </p>
                            </div>
                            <p className="whitespace-pre-line break-keep font-display text-[18px] leading-[1.9] tracking-[0.02em] text-sanskrit-accent dark:text-sanskrit-accent sm:text-[19px]">
                                {verseData.sanskrit}
                            </p>
                        </section>

                        <section className="rounded-[1.1rem] border border-gold-border/16 bg-white/68 p-4 dark:border-dark-border/50 dark:bg-dark-surface/58">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                English
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-[1.9] text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                                {verseData['2.english'] ?? ''}
                            </p>
                        </section>

                        <section className="rounded-[1.1rem] border border-gold-border/16 bg-white/68 p-4 dark:border-dark-border/50 dark:bg-dark-surface/58">
                            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.32em] text-text-secondary/70 dark:text-dark-text-secondary/70">
                                Korean
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[14px] leading-[1.95] text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
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
