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
                <div className="mx-auto flex w-full max-w-[320px] flex-1 flex-col gap-6 sm:gap-7">
                    <div className="flex justify-center px-1 py-2 sm:px-2 sm:py-3">
                        <div className="relative flex h-52 w-full max-w-[240px] items-center justify-center overflow-hidden rounded-[2rem] border border-gold-border/15 bg-gradient-to-b from-gold-primary/[0.08] via-background-secondary/70 to-transparent shadow-[0_18px_40px_-32px_rgba(0,0,0,0.55)] dark:border-dark-border/35 dark:from-gold-light/[0.08] dark:via-dark-surface/70 dark:to-transparent">
                            <div className="pointer-events-none absolute inset-4 rounded-full border border-gold-primary/18 dark:border-gold-light/18" />
                            <div className="pointer-events-none absolute inset-9 rounded-full border border-gold-primary/10 dark:border-gold-light/10" />
                            <div className="pointer-events-none absolute inset-x-8 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent dark:via-gold-light/20" />
                            <div className="pointer-events-none absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-primary/14 to-transparent dark:via-gold-light/14" />
                            <div className="relative flex w-full flex-col items-center justify-center px-6 text-center">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-gold-primary/70 dark:text-gold-light/70">
                                    Chapter
                                </p>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="h-px w-8 bg-gold-primary/20 dark:bg-gold-light/20" />
                                    <p className="font-display text-[42px] font-semibold leading-none tracking-[0.12em] text-text-primary dark:text-dark-text-primary">
                                        {chapterMeta}
                                    </p>
                                    <span className="h-px w-8 bg-gold-primary/20 dark:bg-gold-light/20" />
                                </div>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="rounded-full border border-gold-primary/18 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.36em] text-text-secondary/65 dark:border-gold-light/18 dark:text-dark-text-secondary/70">
                                        Sutra
                                    </span>
                                    <span className="h-2 w-2 rounded-full bg-gold-primary/45 dark:bg-gold-light/45" />
                                    <p className="font-display text-[22px] font-semibold leading-none tracking-[0.14em] text-gold-primary dark:text-gold-light">
                                        {verseMeta}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <section className="space-y-2 border-l border-gold-border/12 pl-4 dark:border-dark-border/45">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-primary/75 dark:text-gold-light/75">
                                Sanskrit
                            </p>
                            <p className="whitespace-pre-line break-keep font-display text-[18px] leading-[1.95] tracking-[0.02em] text-sanskrit-accent dark:text-sanskrit-accent sm:text-[19px]">
                                {verseData.sanskrit}
                            </p>
                        </section>

                        <section className="space-y-2 border-l border-gold-border/12 pl-4 dark:border-dark-border/45">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                                English
                            </p>
                            <p className="whitespace-pre-line break-keep font-sans text-[15px] leading-[1.9] text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                                {verseData['2.english'] ?? ''}
                            </p>
                        </section>

                        <section className="space-y-2 border-l border-gold-border/12 pl-4 dark:border-dark-border/45">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-text-secondary/60 dark:text-dark-text-secondary/65">
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
