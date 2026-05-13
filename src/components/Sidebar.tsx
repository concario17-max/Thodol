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
                    <div className="flex items-end justify-between gap-3 border-b border-gold-border/10 pb-3 dark:border-dark-border/45">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-gold-primary/75 dark:text-gold-light/75">
                                Chapter
                            </p>
                            <p className="mt-1 font-display text-[28px] font-semibold leading-none tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                                {chapterMeta}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.36em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                                Sutra
                            </p>
                            <p className="mt-1 font-display text-[20px] font-semibold leading-none tracking-[0.12em] text-gold-primary dark:text-gold-light">
                                {verseMeta}
                            </p>
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
