import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useYogaData } from '../hooks/useYogaData';
import { useAudio } from '../hooks/useAudio';
import { SutraContent } from '../components/verse/SutraContent';
import { AudioPlayer } from '../components/verse/AudioPlayer';
import { TranslationSection } from '../components/verse/TranslationSection';
import { WordMeanings } from '../components/verse/WordMeanings';
import { useSutraNavigation } from '../hooks/useSutraNavigation';
import { useUI } from '../context/UIContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CommentaryMarkdown } from '../components/commentary/CommentaryMarkdown';

const learningComicImages = import.meta.glob('../../학습만화/*/*.png', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

type ComicEntry = {
    start: number;
    end: number;
    url: string;
};

const learningComicIndex = Object.entries(learningComicImages).reduce<Record<string, ComicEntry[]>>((acc, [path, url]) => {
    const match = path.match(/학습만화\/(\d+)\/(.+)\.png$/);
    if (!match) {
        return acc;
    }

    const chapter = match[1];
    const [startText, endText] = match[2].split('-');
    const start = Number.parseInt(startText, 10);
    const end = Number.parseInt(endText ?? startText, 10);

    if (!acc[chapter]) {
        acc[chapter] = [];
    }

    acc[chapter].push({ start, end, url });
    return acc;
}, {});

Object.values(learningComicIndex).forEach((entries) => {
    entries.sort((left, right) => left.start - right.start || left.end - right.end);
});

const getLearningComicImageUrl = (chapterNum: string, verseNum: string) => {
    const entries = learningComicIndex[chapterNum];
    if (!entries) {
        return null;
    }

    const verse = Number.parseInt(verseNum, 10);
    const match = entries.find((entry) => verse >= entry.start && verse <= entry.end);

    return match?.url ?? null;
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.08,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.3 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 14, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.55,
            ease: 'easeOut',
        },
    },
};

const sharedContentShellClassName =
    'overflow-hidden rounded-[2rem] border border-gold-border/18 bg-shell-commentary shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_40px_-34px_rgba(0,0,0,0.34)] dark:border-dark-border/50 dark:bg-shell-commentary-dark dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_40px_-34px_rgba(0,0,0,0.48)]';

const sharedContentPaddingClassName = 'px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6';

type CommentaryViewMode = 'commentary' | 'comic';

interface CommentaryContentProps {
    chapterNum: string;
    verseNum: string;
    commentaryText?: string;
    navigationControls?: ReactNode;
}

const CommentaryContent = ({ chapterNum, verseNum, commentaryText, navigationControls }: CommentaryContentProps) => {
    const [viewMode, setViewMode] = useState<CommentaryViewMode>('comic');

    useEffect(() => {
        setViewMode('comic');
    }, [chapterNum, verseNum]);

    const learningComicImageUrl = getLearningComicImageUrl(chapterNum, verseNum);

    return (
        <section className="mx-auto w-full space-y-3 px-0 sm:space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
                    Commentary
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20" />
                <div className="ml-auto flex items-center gap-1">
                    {navigationControls ? <div className="min-w-0 shrink-0">{navigationControls}</div> : null}
                    <button
                        type="button"
                        onClick={() => setViewMode((current) => (current === 'commentary' ? 'comic' : 'commentary'))}
                        aria-label={viewMode === 'commentary' ? 'Show comic' : 'Show commentary'}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-border/30 bg-shell-main/90 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-dark-border/55 dark:bg-shell-main-dark/90 dark:text-gold-light"
                    >
                        <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className={`${sharedContentShellClassName} ${sharedContentPaddingClassName} sm:space-y-5`}>
                {viewMode === 'commentary' ? (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="font-display text-[22px] font-semibold tracking-[0.06em] text-text-primary dark:text-dark-text-primary">
                                {chapterNum}.{verseNum}
                            </span>
                        </div>

                        <CommentaryMarkdown
                            content={commentaryText}
                            emptyMessage={
                                <div className="border-l border-gold-border/12 pl-5 font-sans text-[15px] leading-8 text-text-secondary dark:border-dark-border/45 dark:text-dark-text-secondary sm:text-[16px]">
                                    No commentary is available for this verse.
                                </div>
                            }
                        />
                    </div>
                ) : learningComicImageUrl ? (
                    <div className="overflow-hidden rounded-[1.75rem] border border-gold-border/12 bg-[#fbf7ef] p-2 shadow-[0_18px_48px_-32px_rgba(0,0,0,0.28)] dark:border-dark-border/50 dark:bg-[#191714]">
                        <img
                            src={learningComicImageUrl}
                            alt={`Learning comic ${chapterNum}.${verseNum}`}
                            className="block h-auto w-full rounded-[1.15rem] object-contain"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="space-y-3 rounded-[1.5rem] border border-gold-border/12 bg-shell-main/85 p-5 text-sm leading-7 text-text-secondary dark:border-dark-border/45 dark:bg-shell-main-dark/85 dark:text-dark-text-secondary sm:p-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">
                            Learning comic
                        </p>
                        <p>This chapter does not have a comic panel yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

const VerseView = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement>(null);
    const { activeVerseContentMode } = useUI();
    const isCommentaryMode = activeVerseContentMode === 'commentary';

    const { allChapters, loading, error, getVerseInRange, chapters } = useYogaData();

    const {
        isPlaying,
        currentTime,
        duration,
        togglePlay,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleAudioEnded,
        reset,
        seek,
        formatTime,
        progressPercent,
        playbackError,
    } = useAudio(audioRef);

    useEffect(() => {
        if (!chapterNum || !verseNum || !allChapters) {
            return;
        }

        const verseData = getVerseInRange(chapterNum, verseNum);
        if (verseData) {
            const actualNum = verseData.verse ?? Number.parseInt(verseData.id.split('.')[1], 10);
            if (actualNum !== Number.parseInt(verseNum, 10)) {
                navigate(`/chapter/${chapterNum}/verse/${actualNum}`, { replace: true });
            }
        }
    }, [chapterNum, verseNum, allChapters, getVerseInRange, navigate]);

    useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        }
        reset();
    }, [chapterNum, verseNum, reset]);

    useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        }
    }, [isCommentaryMode]);

    const verseData = chapterNum && verseNum ? getVerseInRange(chapterNum, verseNum) : null;
    const currentChapter = allChapters && chapterNum ? allChapters[Number.parseInt(chapterNum, 10)] : null;
    const currentIndex = currentChapter && verseData ? currentChapter.sutras.findIndex((sutra) => sutra.id === verseData.id) : -1;
    const { handlePrev, handleNext } = useSutraNavigation(allChapters, chapterNum, currentIndex);
    const firstChapterNumber = chapters[0]?.chapter ?? 1;
    const lastChapterNumber = chapters[chapters.length - 1]?.chapter ?? firstChapterNumber;
    const currentChapterNumber = currentChapter?.chapter ?? null;
    const currentChapterLength = currentChapter?.sutras.length ?? 0;
    const isFirstVerse = currentChapterNumber !== null && currentChapterNumber === firstChapterNumber && currentIndex === 0;
    const isLastVerse = currentChapterNumber !== null && currentChapterNumber === lastChapterNumber && currentIndex === currentChapterLength - 1;

    if (error) {
        return (
            <div className="flex min-h-full items-center justify-center px-6">
                <div className="max-w-lg text-center">
                    <h1 className="mb-3 font-display text-2xl text-text-primary dark:text-dark-text-primary">Unable to load this verse</h1>
                    <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">{error}</p>
                </div>
            </div>
        );
    }

    if (loading || !allChapters || !chapterNum || !verseNum) {
        return (
            <div className="flex min-h-full items-center justify-center bg-gold-bg dark:bg-dark-bg">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
            </div>
        );
    }

    if (!verseData || !currentChapter) {
        return null;
    }

    const verseNumber = verseData.verse ?? Number.parseInt(verseData.id.split('.')[1], 10);
    const audioSrc = verseData.audio ?? `/mp3/${String(currentChapter.chapter).padStart(3, '0')}_${String(verseNumber).padStart(3, '0')}.mp3`;
    const bodyContentClassName = isCommentaryMode ? 'hidden' : 'space-y-5 sm:space-y-6';
    const navigationDisabledClassName = 'pointer-events-none opacity-25';
    const rightPanelNavigationControls =
        currentIndex >= 0 ? (
            <div className="inline-flex items-center rounded-full border border-gold-border/14 bg-shell-main/80 p-0.5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-sm dark:border-dark-border/70 dark:bg-shell-main-dark/82">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={isFirstVerse}
                    aria-label="Previous verse"
                    className={`grid h-8 w-8 place-items-center rounded-full text-[#5B7282] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#31404b] disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                        isFirstVerse ? navigationDisabledClassName : ''
                    }`}
                >
                    <ChevronLeft className="h-4 w-4 stroke-[1.5]" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLastVerse}
                    aria-label="Next verse"
                    className={`grid h-8 w-8 place-items-center rounded-full text-[#5B7282] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#31404b] disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                        isLastVerse ? navigationDisabledClassName : ''
                    }`}
                >
                    <ChevronRight className="h-4 w-4 stroke-[1.5]" aria-hidden="true" />
                </button>
            </div>
        ) : null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${chapterNum}-${verseNum}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="min-h-full flex flex-col justify-start py-4 text-text-primary transition-colors duration-500 dark:text-dark-text-primary sm:py-6 lg:justify-center"
            >
                <div className="mx-auto flex w-full flex-col gap-5 px-4 sm:gap-7 sm:px-6 lg:px-8">
                    {!isCommentaryMode ? (
                        <motion.div variants={itemVariants}>
                            <div className="relative mx-auto w-full overflow-visible px-0">
                                <section className={`${sharedContentShellClassName} ${sharedContentPaddingClassName}`}>
                                    <div className={bodyContentClassName}>
                                        <motion.div variants={itemVariants}>
                                            <SutraContent sanskrit={verseData.sanskrit} pronunciation={verseData.iast ?? verseData.pronunciation} pronunciationKr={verseData.pronunciation_kr} />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <WordMeanings meanings={verseData.word_meanings} />
                                        </motion.div>

                                        <audio
                                            ref={audioRef}
                                            src={audioSrc}
                                            onTimeUpdate={handleTimeUpdate}
                                            onLoadedMetadata={handleLoadedMetadata}
                                            onEnded={handleAudioEnded}
                                            className="hidden"
                                        />

                                        <motion.div variants={itemVariants}>
                                            <AudioPlayer
                                                isPlaying={isPlaying}
                                                togglePlay={togglePlay}
                                                currentTime={currentTime}
                                                duration={duration}
                                                progressPercent={progressPercent}
                                                formatTime={formatTime}
                                                onSeek={seek}
                                                playbackError={playbackError}
                                            />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <TranslationSection
                                                english={verseData.translation_en ?? verseData['2.english']}
                                                ham={verseData.translation_ham ?? verseData['5.bae_jik']}
                                                gil={verseData.translation_gil ?? verseData['8. ox']}
                                                jimong={verseData.translation_jimong}
                                                suk={verseData.translation_suk ?? verseData['6.bae_uu'] ?? verseData['9. ox-en']}
                                            />
                                        </motion.div>
                                    </div>
                                </section>
                            </div>
                        </motion.div>
                    ) : null}

                    {isCommentaryMode ? (
                        <motion.div variants={itemVariants}>
                            <div className="relative mx-auto w-full overflow-visible px-0">
                                <CommentaryContent
                                    chapterNum={String(currentChapter.chapter)}
                                    verseNum={String(verseNumber)}
                                    commentaryText={verseData.commentary_en}
                                    navigationControls={rightPanelNavigationControls}
                                />
                            </div>
                        </motion.div>
                    ) : null}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerseView;
