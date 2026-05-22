import { lazy, Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { BookOpenText, ChevronRight, Cloud, Sparkles, Target, Zap } from 'lucide-react';
import { YOGA_CHAPTERS_META } from '../constants';
import { useYogaData } from '../hooks/useYogaData';
import { GlassCard } from '../components/ui/GlassCard';
import { Seo } from '../components/Seo';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/site';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));

const getChapterIcon = (chapter: number) => {
    switch (chapter) {
        case 1:
            return <Target className="h-5 w-5" />;
        case 2:
            return <Zap className="h-5 w-5" />;
        case 3:
            return <Sparkles className="h-5 w-5" />;
        case 4:
            return <Cloud className="h-5 w-5" />;
        default:
            return <BookOpenText className="h-5 w-5" />;
    }
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.045,
            delayChildren: 0.05,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.28,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const renderChapterTitle = (title: string) => {
    const lines = title.split(' ').filter(Boolean);

    return lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block">
            {line}
        </span>
    ));
};

const ChapterList = () => {
    const navigate = useNavigate();
    const { chapters, loading, error } = useYogaData();
    const [isCompendiumOpen, setIsCompendiumOpen] = useState<boolean>(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState<boolean>(false);
    const [selectedChapter, setSelectedChapter] = useState<string>('');
    const [selectedVerse, setSelectedVerse] = useState<string>('');
    const hasChapters = chapters.length > 0;
    const startReadingHref = '/chapter/1/verse/1';

    const statusCardClassName =
        'app-panel-card w-full max-w-xl px-6 py-7 text-center';

    if (loading && !hasChapters) {
        return (
            <div className="flex h-full items-center justify-center px-4">
                <div className={statusCardClassName} role="status" aria-live="polite">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/15 bg-gold-surface/70 dark:border-dark-border/60 dark:bg-dark-surface">
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
                    </div>
                    <h1 className="mb-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">Loading chapters</h1>
                    <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                        Preparing the chapter list and reading tools.
                    </p>
                </div>
            </div>
        );
    }

    if (error && !hasChapters) {
        return (
            <div className="flex h-full items-center justify-center px-4">
                <div className={statusCardClassName} role="alert">
                    <h1 className="mb-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">Unable to load the Yoga Sutras</h1>
                    <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">{error}</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="app-button-primary mt-5 px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-dark-bg"
                    >
                        Retry loading
                    </button>
                </div>
            </div>
        );
    }

    if (!loading && !error && !hasChapters) {
        return (
            <div className="flex h-full items-center justify-center px-4">
                <div className={statusCardClassName} role="status">
                    <h1 className="mb-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">No chapters available</h1>
                    <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                        The reading surface is empty right now.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="app-button-secondary mt-5 px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-dark-bg"
                    >
                        Reload
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6 transition-colors duration-500 md:py-8 lg:flex lg:h-full lg:max-w-7xl lg:flex-col lg:overflow-hidden lg:py-4">
            <Seo title={SITE_NAME} description={SITE_DESCRIPTION} canonicalPath="/" />
            <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mb-8 flex flex-col items-center text-center md:mb-10 lg:mb-4 lg:flex-none">
                <motion.div variants={itemVariants} className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold-border bg-gold-surface/50 dark:border-dark-border dark:bg-dark-surface lg:mb-3">
                    <BookOpenText className="h-5 w-5 text-gold-primary opacity-80" />
                </motion.div>
                <motion.h1 variants={itemVariants} className="mb-4 font-display text-[44px] font-medium tracking-[0.12em] text-text-primary drop-shadow-sm dark:text-dark-text-primary sm:text-[56px] md:text-[64px] lg:mb-3 lg:text-[54px]">
                    YOGA SUTRAS
                </motion.h1>
                <motion.p variants={itemVariants} className="mb-6 max-w-2xl font-display text-[15px] italic tracking-[0.14em] text-gold-primary dark:text-gold-light md:text-lg lg:mb-4">
                    A calm editorial reading space for Sanskrit, pronunciation, translation, audio, and commentary.
                </motion.p>

                <motion.div variants={itemVariants} className="mb-6 flex flex-col items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.24em] text-text-secondary sm:flex-row sm:gap-4 lg:mb-5">
                    <button
                        type="button"
                        onClick={() => setIsCompendiumOpen(true)}
                        className="app-button-ghost px-3 py-2 hover:text-gold-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-dark-bg"
                    >
                        Compendium
                    </button>
                    <div className="h-1 w-1 rotate-45 bg-gold-border/50" />
                    <button
                        type="button"
                        onClick={() => setIsLexiconOpen(true)}
                        className="app-button-ghost px-3 py-2 hover:text-gold-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-dark-bg"
                    >
                        Lexicon
                    </button>
                </motion.div>

                <motion.div variants={itemVariants} className="mx-auto mb-8 flex w-full max-w-2xl flex-col items-center gap-3 rounded-[2rem] px-4 py-4 app-panel-card lg:mb-5">
                    <button
                        type="button"
                        onClick={() => navigate(startReadingHref)}
                        className="app-button-primary w-full gap-2 px-5 py-3 text-sm font-semibold sm:w-auto"
                    >
                        Start reading
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <p className="text-center text-xs leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                        Jump straight to Chapter 1, Sutra 1. The chapter cards below keep browsing fast and focused.
                    </p>
                </motion.div>

                <motion.div variants={itemVariants} className="mx-auto mb-10 flex w-full max-w-md items-center justify-center opacity-40 lg:mb-5">
                    <div className="h-px flex-1 bg-gold-border" />
                    <div className="mx-4 text-lg leading-none text-gold-primary">
                        <BookOpenText className="h-4 w-4" />
                    </div>
                    <div className="h-px flex-1 bg-gold-border" />
                </motion.div>

                <motion.div variants={itemVariants} className="relative z-10 mx-auto mb-5 flex w-full max-w-2xl flex-col items-center justify-between gap-3 rounded-[1.5rem] p-2.5 app-panel-card sm:flex-row sm:gap-0 sm:p-3 lg:mb-0">
                    <div className="flex w-full flex-1 flex-col items-start border-b border-gold-border/30 px-2 pb-2 sm:border-b-0 sm:border-r sm:px-4 sm:pb-0">
                        <span className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-gold-primary drop-shadow-sm">Chapter</span>
                        <select
                            className="app-select-shell w-full text-sm font-medium outline-none focus:text-gold-primary dark:focus:text-gold-light"
                            value={selectedChapter}
                            onChange={(event) => {
                                setSelectedChapter(event.target.value);
                                setSelectedVerse('');
                            }}
                        >
                            <option value="">Select Chapter</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.chapter} value={chapter.chapter} className="text-base">
                                    {chapter.chapter}. {chapter.meta.name_korean}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex w-full flex-1 flex-col items-start px-2 pt-0.5 sm:px-6 sm:pt-0">
                        <span className="mb-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-gold-primary drop-shadow-sm">Verse</span>
                        <select
                            className="app-select-shell w-full text-sm font-medium outline-none focus:text-gold-primary disabled:opacity-50 dark:focus:text-gold-light"
                            value={selectedVerse}
                            disabled={!selectedChapter}
                            onChange={(event) => {
                                const verse = event.target.value;
                                setSelectedVerse(verse);
                                if (selectedChapter && verse) {
                                    navigate(`/chapter/${selectedChapter}/verse/${verse}`);
                                }
                            }}
                        >
                            <option value="">{selectedChapter ? 'Select Sutra' : 'Select Chapter First'}</option>
                            {selectedChapter &&
                                chapters
                                    .find((chapter) => chapter.chapter === parseInt(selectedChapter, 10))
                                    ?.sutras.map((sutra) => {
                                        const sutraNumber = sutra.id.split('.')[1];
                                        return (
                                            <option key={sutra.id} value={sutraNumber} className="text-base">
                                                Sutra {sutraNumber}
                                            </option>
                                        );
                                    })}
                        </select>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div id="chapter-grid" initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-12 sm:grid-cols-2 sm:gap-6 lg:flex-1 lg:grid-cols-4 lg:items-stretch lg:gap-4 lg:px-0 lg:pb-4">
                {chapters.map((chapter) => {
                    const chapterInfo = YOGA_CHAPTERS_META[chapter.chapter];

                    return (
                        <motion.div key={chapter.chapter} variants={itemVariants} className="lg:min-h-0">
                            <GlassCard
                                href={`/chapter/${chapter.chapter}/verse/1`}
                                icon={getChapterIcon(chapter.chapter)}
                                className="lg:h-full"
                                subtitle={`CHAPTER ${chapter.chapter}`}
                                title={
                                    <>
                                        <span className="font-display text-[30px] font-medium tracking-[0.04em] md:text-[34px]">
                                            {renderChapterTitle(chapterInfo?.name_english || chapter.meta.name_english)}
                                        </span>
                                        <span className="mt-1 font-noto-kr text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{chapterInfo?.name_korean || chapter.meta.name_korean}</span>
                                    </>
                                }
                                description={chapterInfo?.description || 'Read sutras of this part.'}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>

            <Suspense fallback={null}>
                {isCompendiumOpen && <CompendiumModal isOpen={isCompendiumOpen} onClose={() => setIsCompendiumOpen(false)} />}
                {isLexiconOpen && <LexiconModal isOpen={isLexiconOpen} onClose={() => setIsLexiconOpen(false)} />}
            </Suspense>
        </div>
    );
};

export default ChapterList;
