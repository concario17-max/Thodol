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
                        <div className="relative flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-shell-main via-shell-commentary/55 to-shell-canvas/20 shadow-[0_16px_34px_-30px_rgba(0,0,0,0.4)] transition-colors duration-500 dark:from-shell-main-dark dark:via-shell-commentary-dark/76 dark:to-shell-canvas-dark/54">
                            <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-gold-primary/14 to-transparent dark:via-gold-light/14" />
                            <div className="pointer-events-none absolute inset-y-10 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-gold-primary/12 to-transparent dark:via-gold-light/12" />
                            <div className="pointer-events-none absolute left-8 top-8 h-10 w-10 border-l border-t border-gold-primary/12 dark:border-gold-light/12" />
                            <div className="pointer-events-none absolute bottom-8 right-8 h-10 w-10 border-b border-r border-gold-primary/12 dark:border-gold-light/12" />

                            <style>{`
                                @keyframes sidebar-marker-top {
                                    0%, 100% { transform: translateX(0); }
                                    50% { transform: translateX(6px); }
                                }
                                @keyframes sidebar-marker-center {
                                    0%, 100% { transform: translateY(0); }
                                    50% { transform: translateY(-6px); }
                                }
                                @keyframes sidebar-marker-bottom {
                                    0%, 100% { transform: translateX(0); }
                                    50% { transform: translateX(-6px); }
                                }
                                .sidebar-marker-top {
                                    animation: sidebar-marker-top 6.2s ease-in-out infinite;
                                }
                                .sidebar-marker-center {
                                    animation: sidebar-marker-center 7.4s ease-in-out infinite;
                                }
                                .sidebar-marker-bottom {
                                    animation: sidebar-marker-bottom 6.8s ease-in-out infinite;
                                }
                                @media (prefers-reduced-motion: reduce) {
                                    .sidebar-marker-top,
                                    .sidebar-marker-center,
                                    .sidebar-marker-bottom {
                                        animation: none;
                                    }
                                }
                            `}</style>

                            <div className="relative flex h-full w-full flex-col justify-between px-7 py-7 text-center">
                                <div
                                    className={`sidebar-marker-top flex items-start justify-between text-[9px] font-semibold uppercase tracking-[0.42em] text-gold-primary/70 transition-opacity duration-700 ease-out dark:text-gold-light/70 ${
                                        markerReady ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <span>Sutra</span>
                                    <span className="text-text-secondary/55 dark:text-dark-text-secondary/65">Axis</span>
                                </div>

                                <div className="flex flex-1 items-center justify-center">
                                    <p
                                        className={`sidebar-marker-center font-display text-[54px] font-semibold leading-none tracking-[0.1em] text-text-primary transition-opacity duration-700 ease-out dark:text-dark-text-primary ${
                                            markerReady ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        {verseMeta}
                                    </p>
                                </div>

                                <div
                                    className={`sidebar-marker-bottom flex items-end justify-between transition-opacity duration-700 ease-out ${
                                        markerReady ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    <div className="flex flex-col items-start gap-1 text-left">
                                        <p className="text-[9px] font-semibold uppercase tracking-[0.42em] text-text-secondary/55 dark:text-dark-text-secondary/65">
                                            Chapter
                                        </p>
                                        <span className="h-px w-12 bg-gradient-to-r from-gold-primary/22 to-transparent dark:from-gold-light/22" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-display text-[28px] font-semibold leading-none tracking-[0.14em] text-gold-primary dark:text-gold-light">
                                            {chapterMeta}
                                        </span>
                                        <span className="h-2.5 w-2.5 rounded-full bg-gold-primary/55 shadow-[0_0_0_1px_rgba(191,148,48,0.18)] dark:bg-gold-light/55 dark:shadow-[0_0_0_1px_rgba(255,220,160,0.16)]" />
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
