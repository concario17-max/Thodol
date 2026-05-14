import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import { useYogaData } from '../hooks/useYogaData';
import { SidebarLayout } from './ui/SidebarLayout';

const Sidebar = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const { isSidebarOpen, setIsSidebarOpen, isDesktopSidebarOpen } = useUI();
    const { allChapters, loading, getVerseInRange } = useYogaData();
    const [markerReady, setMarkerReady] = useState(false);

    const chapterNumber = chapterNum ? parseInt(chapterNum, 10) : null;
    const currentChapter = chapterNumber ? allChapters?.[chapterNumber] ?? null : null;
    const verseData = chapterNum && verseNum ? getVerseInRange(chapterNum, verseNum) : null;

    const chapterMeta = currentChapter ? String(currentChapter.chapter).padStart(2, '0') : '00';
    const verseMeta = verseNum ? String(parseInt(verseNum, 10)).padStart(2, '0') : '00';

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setMarkerReady(true));

        return () => window.cancelAnimationFrame(frame);
    }, []);

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
                    <div className="flex justify-center px-1 py-3 sm:px-2 sm:py-4">
                        <div className="relative flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-gold-border/14 bg-gradient-to-br from-shell-main via-shell-commentary/65 to-shell-canvas/30 shadow-[0_18px_40px_-32px_rgba(0,0,0,0.45)] transition-colors duration-500 dark:border-dark-border/40 dark:from-shell-main-dark dark:via-shell-commentary-dark/80 dark:to-shell-canvas-dark/60">
                            <div className="pointer-events-none absolute inset-4 rounded-[1.45rem] border border-gold-primary/12 dark:border-gold-light/12" />
                            <div className="pointer-events-none absolute inset-8 rounded-[1.2rem] border border-gold-primary/8 dark:border-gold-light/8" />
                            <div className="pointer-events-none absolute inset-x-9 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-primary/16 to-transparent dark:via-gold-light/16" />
                            <div className="pointer-events-none absolute inset-y-9 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-primary/12 to-transparent dark:via-gold-light/12" />
                            <div className="pointer-events-none absolute left-6 top-6 h-8 w-8 border-l border-t border-gold-primary/18 dark:border-gold-light/18" />
                            <div className="pointer-events-none absolute bottom-6 right-6 h-8 w-8 border-b border-r border-gold-primary/18 dark:border-gold-light/18" />

                            <div className="relative flex h-full w-full flex-col justify-between px-7 py-7 text-center">
                                <div
                                    className={`flex items-start justify-between text-[9px] font-semibold uppercase tracking-[0.42em] text-gold-primary/70 transition-all duration-700 ease-out dark:text-gold-light/70 ${
                                        markerReady ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                                    }`}
                                >
                                    <span>Chapter</span>
                                    <span className="text-text-secondary/55 dark:text-dark-text-secondary/65">Axis</span>
                                </div>

                                <div className="flex flex-1 items-center justify-center">
                                    <p
                                        className={`font-display text-[42px] font-semibold leading-none tracking-[0.12em] text-text-primary transition-all duration-700 ease-out dark:text-dark-text-primary ${
                                            markerReady ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                        }`}
                                    >
                                        {chapterMeta}
                                    </p>
                                </div>

                                <div
                                    className={`flex items-end justify-between transition-all duration-700 ease-out ${
                                        markerReady ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'
                                    }`}
                                >
                                    <div className="flex flex-col items-start gap-1 text-left">
                                        <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-text-secondary/55 dark:text-dark-text-secondary/65">
                                            Sutra
                                        </p>
                                        <span className="h-px w-9 bg-gold-primary/20 dark:bg-gold-light/20" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.32em] text-text-secondary/50 dark:text-dark-text-secondary/60">
                                            {verseMeta}
                                        </span>
                                        <span className="h-2 w-2 rounded-full border border-gold-primary/30 bg-gold-primary/50 dark:border-gold-light/30 dark:bg-gold-light/50" />
                                    </div>
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
