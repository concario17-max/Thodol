import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useYogaData } from '../hooks/useYogaData';
import { SutraContent } from '../components/verse/SutraContent';
import { WordMeanings } from '../components/verse/WordMeanings';
import { AudioPlayer } from '../components/verse/AudioPlayer';
import { useSutraNavigation } from '../hooks/useSutraNavigation';
import { useUI } from '../context/UIContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CommentaryMarkdown } from '../components/commentary/CommentaryMarkdown';
import { useAudio } from '../hooks/useAudio';
import { MobileVerseGuide } from '../components/verse/MobileVerseGuide';

const extractCommentaryTitle = (content?: string | null) => {
    if (!content) {
        return null;
    }

    const headingMatch = content.match(/^#\s+(.+?)(?:\r?\n|$)/m);
    return headingMatch?.[1]?.trim() ?? null;
};

const stripCommentaryTitleBlock = (content?: string | null) => {
    if (!content) {
        return content ?? null;
    }

    return content.replace(/^#\s+.+?(?:\r?\n){2,}/, '').trimStart();
};

const comicPageModules = import.meta.glob('../../학습만화/1/*.png', {
    eager: true,
    import: 'default',
}) as Record<string, string>;

const getChapter1ComicPage = (verseNumber: number) =>
    comicPageModules[`../../학습만화/1/${verseNumber}.png`] ?? null;

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
    'overflow-hidden rounded-[2rem] bg-[#fbf7ef] dark:bg-[#111]/35';

const sharedContentPaddingClassName = 'px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6';
const emptyDataNotice = '아직 데이터가 없습니다.';

type CommentaryViewMode = 'commentary' | 'comic';

interface CommentaryContentProps {
    chapterNum: string;
    verseNum: string;
    commentaryText?: string;
    navigationControls?: ReactNode;
    comicPages?: string[];
}

interface VersePanelHeaderProps {
    label: string;
    navigationControls?: ReactNode;
    rightAction?: ReactNode;
}

const VersePanelHeader = ({ label, navigationControls, rightAction }: VersePanelHeaderProps) => (
    <div className="flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35">
        <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
            {label}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20" />
        <div className="ml-auto flex items-center gap-1">
            {navigationControls ? <div className="min-w-0 shrink-0">{navigationControls}</div> : null}
            {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
        </div>
    </div>
);

const CommentaryContent = ({ chapterNum, verseNum, commentaryText, navigationControls, comicPages = [] }: CommentaryContentProps) => {
    const [viewMode, setViewMode] = useState<CommentaryViewMode>('comic');
    const [commentaryTitle, setCommentaryTitle] = useState<string | null>(() => extractCommentaryTitle(commentaryText));

    useEffect(() => {
        setViewMode('comic');
    }, [chapterNum, verseNum]);

    useEffect(() => {
        setCommentaryTitle(extractCommentaryTitle(commentaryText));
    }, [commentaryText]);

    const commentaryBodyText = stripCommentaryTitleBlock(commentaryText);

    return (
        <section className="mx-auto w-full space-y-3 px-0 sm:space-y-4">
            <VersePanelHeader
                label="Commentary"
                navigationControls={navigationControls}
                rightAction={
                    <button
                        type="button"
                        onClick={() => setViewMode((current) => (current === 'commentary' ? 'comic' : 'commentary'))}
                        aria-label={viewMode === 'commentary' ? 'Show comic' : 'Show commentary'}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-border/30 bg-shell-main/90 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-dark-border/55 dark:bg-shell-main-dark/90 dark:text-gold-light"
                    >
                        <ImageIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                }
            />

            <div className={`${sharedContentShellClassName} ${sharedContentPaddingClassName} sm:space-y-5`}>
                {viewMode === 'commentary' ? (
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-baseline gap-2 overflow-hidden">
                            <span className="shrink-0 whitespace-nowrap font-sans text-[15px] font-medium leading-none tracking-[0.04em] text-text-secondary/75 dark:text-dark-text-secondary/75 sm:text-[17px]">
                                {chapterNum}.{verseNum}
                            </span>
                            <span className="min-w-0 truncate font-sans text-[22px] font-semibold leading-tight tracking-[0.01em] text-text-primary dark:text-dark-text-primary sm:text-[28px]">
                                {commentaryTitle ?? ''}
                            </span>
                        </div>

                        <CommentaryMarkdown
                            content={commentaryBodyText}
                            emptyMessage={
                                <div className="rounded-[1.4rem] border border-gold-border/10 bg-white/55 px-4 py-4 text-left shadow-sm dark:border-dark-border/45 dark:bg-[#111]/35 sm:px-5 sm:py-5">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                                        안내
                                    </p>
                                    <p className="mt-3 whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                                        {emptyDataNotice}
                                    </p>
                                </div>
                            }
                        />
                    </div>
                ) : comicPages.length ? (
                    <div className="space-y-4">
                        {comicPages.map((pageUrl) => (
                            <figure
                                key={pageUrl}
                                className="overflow-hidden rounded-[1.5rem] border border-gold-border/10 bg-white/70 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.5)] dark:border-dark-border/45 dark:bg-[#111]/35"
                            >
                                <img
                                    src={pageUrl}
                                    alt='Chapter 1 learning comic page'
                                    className="block h-auto w-full"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </figure>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[1.4rem] border border-gold-border/10 bg-white/55 px-4 py-4 text-left shadow-sm dark:border-dark-border/45 dark:bg-[#111]/35 sm:px-5 sm:py-5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-text-secondary/60 dark:text-dark-text-secondary/65">
                            안내
                        </p>
                        <p className="mt-3 whitespace-pre-line break-keep font-sans text-[15px] leading-8 text-text-primary dark:text-dark-text-primary sm:text-[16px]">
                            {emptyDataNotice}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

const VerseView = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const navigate = useNavigate();
    const { activeVerseContentMode } = useUI();
    const isCommentaryMode = activeVerseContentMode === 'commentary';

    const { allChapters, loading, error, getVerseInRange, chapters } = useYogaData();

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
    }, [chapterNum, verseNum]);

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
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const {
        isPlaying,
        currentTime,
        duration,
        playbackError,
        togglePlay,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleAudioEnded,
        reset,
        seek,
        formatTime,
        progressPercent,
    } = useAudio(audioRef);
    const shouldShowPronunciationAudio =
        verseData?.sourceKind === 'prayer' &&
        ['prayer-3', 'prayer-4', 'prayer-5'].includes(verseData.sourceSectionId ?? '') &&
        Boolean(verseData?.audioUrl);

    useEffect(() => {
        reset();
    }, [reset, verseData?.audioUrl, verseData?.id]);

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
    const bodyContentClassName = isCommentaryMode ? 'hidden' : 'space-y-5 sm:space-y-6';
    const navigationDisabledClassName = 'pointer-events-none opacity-25';
    const bodySections: Array<{
        label: string;
        body?: string;
        tone?: 'hero' | 'pronunciation' | 'refined' | 'translation';
        trailing?: ReactNode;
        hideEmptyNotice?: boolean;
    }> = [];

    bodySections.push({
        label: '티벳어',
        body: verseData.text?.tibetan ?? undefined,
        tone: 'hero' as const,
    });

    if (shouldShowPronunciationAudio) {
        bodySections.push({
            label: '발음',
            body: verseData.korean_pronunciation ?? undefined,
            tone: 'pronunciation' as const,
            trailing: (
                <div className="space-y-4">
                    <audio
                        ref={audioRef}
                        src={verseData.audioUrl ?? undefined}
                        preload="metadata"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={handleAudioEnded}
                        className="hidden"
                    />
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
                    <div className="h-px w-full bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20" />
                </div>
            ),
        });
    }

    bodySections.push(
        {
            label: '영어 번역',
            body: verseData.translation_en ?? verseData.text?.english ?? undefined,
            tone: 'refined' as const,
        },
        {
            label: '중암 선혜',
            body: verseData.translation_joongam ?? undefined,
            tone: 'translation' as const,
        },
        {
            label: '류시화',
            body: verseData.translation_ryu ?? undefined,
            tone: 'translation' as const,
            hideEmptyNotice: currentChapter.chapter === 1 && verseNumber >= 1 && verseNumber <= 8,
        },
    );
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
                className="min-h-full flex flex-col justify-start py-4 text-text-primary transition-colors duration-500 dark:text-dark-text-primary sm:py-6 lg:justify-start"
            >
                <div className="mx-auto flex w-full flex-col gap-5 px-4 sm:gap-7 sm:px-6 lg:px-8">
                    {isCommentaryMode && (
                        <MobileVerseGuide
                            chapterNum={chapterNum ?? ''}
                            verseNum={verseNum ?? ''}
                            koreanText={verseData.translation_ham ?? undefined}
                        />
                    )}
                    {!isCommentaryMode ? (
                        <motion.div variants={itemVariants}>
                            <div className="relative mx-auto w-full overflow-visible px-0">
                                <div className="space-y-3 sm:space-y-4">
                                    <VersePanelHeader label="Verse" navigationControls={rightPanelNavigationControls} />
                                    <section className={`${sharedContentShellClassName} ${sharedContentPaddingClassName}`}>
                                        <div className={bodyContentClassName}>
                                            <motion.div variants={itemVariants}>
                                                <SutraContent sections={bodySections} />
                                            </motion.div>

                                            <motion.div variants={itemVariants}>
                                                <WordMeanings meanings={verseData.word_meanings} />
                                            </motion.div>
                                        </div>
                                    </section>
                                </div>
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
                                    comicPages={currentChapter.chapter === 1 ? [getChapter1ComicPage(verseNumber)].filter(Boolean) as string[] : []}
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
