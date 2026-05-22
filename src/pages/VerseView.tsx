import { useRef, useEffect, useState, type CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, SquareArrowOutUpRight } from 'lucide-react';
import { useYogaData } from '../hooks/useYogaData';
import { useAudio } from '../hooks/useAudio';
import { SutraContent } from '../components/verse/SutraContent';
import { AudioPlayer } from '../components/verse/AudioPlayer';
import { TranslationSection } from '../components/verse/TranslationSection';
import { WordMeanings } from '../components/verse/WordMeanings';
import { useSutraNavigation } from '../hooks/useSutraNavigation';
import { useUI } from '../context/UIContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import type { CommentaryBlock } from '../data/chapter1Commentary';
import { Seo } from '../components/Seo';
import { SITE_DESCRIPTION } from '../lib/site';
import { getLearningComicDimensions } from '../lib/media';

const learningComicImageLoaders = {
    ...import.meta.glob('../assets/learning-comic/chapter-1/*.png', {
        import: 'default',
    }),
    ...import.meta.glob('../assets/learning-comic/chapter-2/*.png', {
        import: 'default',
    }),
    ...import.meta.glob('../assets/learning-comic/chapter-3/*.png', {
        import: 'default',
    }),
    ...import.meta.glob('../assets/learning-comic/chapter-4/*.png', {
        import: 'default',
    }),
} as Record<string, () => Promise<string>>;

const learningComicChapterPaths: Record<'1' | '2' | '3' | '4', string> = {
    1: '../assets/learning-comic/chapter-1',
    2: '../assets/learning-comic/chapter-2',
    3: '../assets/learning-comic/chapter-3',
    4: '../assets/learning-comic/chapter-4',
};

const getLearningComicImageLoader = (chapterNum: string, verseNum: string) => {
    if (chapterNum !== '1' && chapterNum !== '2' && chapterNum !== '3' && chapterNum !== '4') {
        return null;
    }

    const chapterPath = learningComicChapterPaths[chapterNum as '1' | '2' | '3' | '4'];

    return learningComicImageLoaders[`${chapterPath}/${verseNum}.png`] ?? null;
};

const commentaryLoaders: Record<
    '1' | '2' | '3' | '4',
    () => Promise<{ commentary: Record<string, CommentaryBlock[]> }>
> = {
    1: () => import('../data/chapter1Commentary').then((module) => ({ commentary: module.chapter1Commentary })),
    2: () => import('../data/chapter2Commentary').then((module) => ({ commentary: module.chapter2Commentary })),
    3: () => import('../data/chapter3Commentary').then((module) => ({ commentary: module.chapter3Commentary })),
    4: () => import('../data/chapter4Commentary').then((module) => ({ commentary: module.chapter4Commentary })),
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.04,
        },
    },
    exit: {
        opacity: 0,
        y: -6,
        transition: { duration: 0.22 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.26,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const sharedContentShellClassName =
    'overflow-hidden rounded-[2rem] border border-gold-border/18 bg-shell-commentary shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_14px_40px_-34px_rgba(0,0,0,0.34)] dark:border-dark-border/50 dark:bg-shell-commentary-dark dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_14px_40px_-34px_rgba(0,0,0,0.48)]';

const sharedContentPaddingClassName = 'px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6';

const routeStateCardClassName =
    'app-panel-card w-full max-w-xl px-6 py-7 text-center';

type CommentaryRow = readonly string[] | { label: string; value: string };

type RenderableTable = {
    headers: readonly string[];
    rows: ReadonlyArray<CommentaryRow>;
};

const isTableRowObject = (row: CommentaryRow): row is { label: string; value: string } => !Array.isArray(row);

const toCells = (row: CommentaryRow) => (isTableRowObject(row) ? [row.label, row.value] : [...row]);

const renderTable = (table: RenderableTable) => {
    const rowCellCount = table.rows.reduce((max, row) => Math.max(max, toCells(row).length), 0);
    const columnCount = Math.max(table.headers.length, rowCellCount, 1);
    const gridStyle: CSSProperties = {
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    };

    return (
        <div className="overflow-hidden border-y border-gold-border/12 dark:border-dark-border/45">
            <div className="grid border-b border-gold-border/12 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light" style={gridStyle}>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div key={`${table.headers[index] ?? 'header'}-${index}`} className={`px-3 py-2 ${index > 0 ? 'border-l border-gold-border/12 dark:border-dark-border/45' : ''}`}>
                        {table.headers[index] ?? ''}
                    </div>
                ))}
            </div>

            {table.rows.map((row, rowIndex) => {
                const cells = toCells(row);
                const paddedCells = Array.from({ length: columnCount }, (_, index) => cells[index] ?? '');

                return (
                    <div key={`row-${rowIndex}`} className="grid border-b border-gold-border/10 last:border-b-0" style={gridStyle}>
                        {paddedCells.map((cell, cellIndex) => (
                            <div
                                key={`cell-${rowIndex}-${cellIndex}`}
                                className={`px-3 py-3 text-sm leading-relaxed ${
                                    cellIndex > 0 ? 'border-l border-gold-border/10 dark:border-dark-border/40' : ''
                                } ${cellIndex === 0 ? 'font-medium text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}
                            >
                                {cell}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

const renderCommentaryBlock = (block: CommentaryBlock) => (
    <section key={block.title} className="space-y-3 border-l border-gold-border/12 pl-4 dark:border-dark-border/45">
        <h3 className="font-sans text-[13px] font-semibold leading-snug tracking-[0.02em] text-text-primary dark:text-dark-text-primary sm:text-[14px]">
            {block.title}
        </h3>

        {block.paragraphs?.map((paragraph, index) => (
            <p key={`${block.title}-p-${index}`} className="font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                {paragraph}
            </p>
        ))}

        {block.table ? renderTable(block.table) : null}

        {block.bullets ? (
            <ul className="space-y-2 font-sans text-[14px] leading-7 text-text-secondary dark:text-dark-text-secondary sm:text-[15px]">
                {block.bullets.map((item, index) => {
                    const match = item.match(/^(\d+)\.\s+(.*)$/);
                    const marker = match ? `${match[1]}.` : '-';
                    const text = match ? match[2] : item;

                    return (
                        <li key={`${block.title}-b-${index}`} className="flex gap-3">
                            <span className="shrink-0 font-semibold text-text-primary dark:text-dark-text-primary">{marker}</span>
                            <span className="min-w-0 flex-1 break-words">{text}</span>
                        </li>
                    );
                })}
            </ul>
        ) : null}
    </section>
);

type CommentaryViewMode = 'commentary' | 'comic';

const CommentaryContent = ({ chapterNum, verseNum }: { chapterNum: string; verseNum: string }) => {
    const [viewMode, setViewMode] = useState<CommentaryViewMode>('comic');
    const [commentarySource, setCommentarySource] = useState<Record<string, CommentaryBlock[]> | null>(null);
    const [isCommentaryLoading, setIsCommentaryLoading] = useState<boolean>(true);
    const [learningComicImageUrl, setLearningComicImageUrl] = useState<string | null>(null);
    const [isLoadingComicImage, setIsLoadingComicImage] = useState<boolean>(true);

    useEffect(() => {
        setViewMode('comic');
    }, [chapterNum, verseNum]);

    useEffect(() => {
        let cancelled = false;
        const loader = chapterNum === '1' || chapterNum === '2' || chapterNum === '3' || chapterNum === '4' ? commentaryLoaders[chapterNum] : null;

        setCommentarySource(null);
        setIsCommentaryLoading(true);

        if (!loader) {
            setIsCommentaryLoading(false);
            return () => {
                cancelled = true;
            };
        }

        loader()
            .then(({ commentary }) => {
                if (!cancelled) {
                    setCommentarySource(commentary);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setCommentarySource(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsCommentaryLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [chapterNum, verseNum]);

    useEffect(() => {
        let cancelled = false;
        const loader = getLearningComicImageLoader(chapterNum, verseNum);

        setLearningComicImageUrl(null);
        setIsLoadingComicImage(true);

        if (!loader) {
            setIsLoadingComicImage(false);
            return () => {
                cancelled = true;
            };
        }

        loader()
            .then((url) => {
                if (!cancelled) {
                    setLearningComicImageUrl(url);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setLearningComicImageUrl(null);
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoadingComicImage(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [chapterNum, verseNum]);

    const commentaryKey = chapterNum === '1' || chapterNum === '4' ? `${chapterNum}.${verseNum}` : verseNum;
    const commentaryBlocks = commentarySource?.[commentaryKey] ?? null;
    const inlineHeading = commentaryBlocks?.[0]?.title ?? null;
    const bodyBlocks = commentaryBlocks?.length ? commentaryBlocks.slice(1) : null;
    const shouldShowComicFallback = isLoadingComicImage || !learningComicImageUrl;
    const shouldShowCommentaryLoading = isCommentaryLoading;
    const comicDimensions = getLearningComicDimensions(chapterNum);

    return (
        <section className="mx-auto w-full max-w-[58rem] space-y-3 px-4 sm:space-y-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.34em] text-gold-primary/70 dark:text-gold-light/70">
                    해설
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20" />
                <button
                    type="button"
                    onClick={() => setViewMode((current) => (current === 'commentary' ? 'comic' : 'commentary'))}
                    aria-label={viewMode === 'commentary' ? '\uD559\uC2B5\uB9CC\uD654 \uBCF4\uAE30' : '\uD574\uC124 \uBCF4\uAE30'}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-border/30 bg-shell-main/90 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-dark-border/55 dark:bg-shell-main-dark/90 dark:text-gold-light"
                >
                    <SquareArrowOutUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>

            <div className={`${sharedContentShellClassName} ${sharedContentPaddingClassName} sm:space-y-5`}>
                {viewMode === 'commentary' ? (
                    shouldShowCommentaryLoading ? (
                        <div className="space-y-3 rounded-[1.5rem] border border-gold-border/12 bg-shell-main/85 p-5 text-sm leading-7 text-text-secondary shadow-[0_18px_48px_-34px_rgba(0,0,0,0.18)] dark:border-dark-border/45 dark:bg-shell-main-dark/85 dark:text-dark-text-secondary sm:p-6">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">
                                해설
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold-primary border-t-transparent" />
                                <p>해설을 불러오는 중이야.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <span className="font-display text-[20px] font-semibold tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
                                    {chapterNum}.{verseNum}
                                </span>
                                {inlineHeading ? <span className="font-sans text-[14px] font-medium text-text-secondary dark:text-dark-text-secondary">{inlineHeading}</span> : null}
                            </div>

                            {bodyBlocks && bodyBlocks.length > 0 ? (
                                <div className="space-y-3 sm:space-y-4">{bodyBlocks.map(renderCommentaryBlock)}</div>
                            ) : (
                                <div className="border-l border-gold-border/12 pl-4 font-sans text-[14px] leading-7 text-text-secondary dark:border-dark-border/45 dark:text-dark-text-secondary sm:text-[15px]">
                                    이 수트라에는 아직 해설이 없어.
                                </div>
                            )}
                        </>
                    )
                ) : !shouldShowComicFallback ? (
                    <div className="overflow-hidden rounded-[1.75rem] border border-gold-border/12 bg-[#fbf7ef] p-3 shadow-[0_18px_48px_-32px_rgba(0,0,0,0.28)] dark:border-dark-border/50 dark:bg-[#191714]">
                        <img
                            src={learningComicImageUrl}
                            width={comicDimensions.width}
                            height={comicDimensions.height}
                            alt={`\uD559\uC2B5\uB9CC\uD654 ${chapterNum}.${verseNum}`}
                            className="block h-auto w-full rounded-[1.15rem] object-contain"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                ) : (
                    <div className="space-y-3 rounded-[1.5rem] border border-gold-border/12 bg-shell-main/85 p-5 text-sm leading-7 text-text-secondary dark:border-dark-border/45 dark:bg-shell-main-dark/85 dark:text-dark-text-secondary sm:p-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">
                            학습만화
                        </p>
                        <p>\uD559\uC2B5\uB9CC\uD654\uB294 \uD604\uC7AC 1, 2, 3\uC7A5\uC5D0\uB9CC \uC774\uBBF8\uC9C0\uAC00 \uC900\uBE44\uB418\uC5B4 \uC788\uC5B4.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

const VerseView = () => {
    const { chapterNum, verseNum, '*': extraPath } = useParams<{ chapterNum?: string; verseNum?: string; '*': string | undefined }>();
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement>(null);
    const { activeVerseContentMode } = useUI();
    const isCommentaryMode = activeVerseContentMode === 'commentary';

    const { allChapters, loading, error, getVerseInRange } = useYogaData();

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
            const actualNum = parseInt(verseData.id.split('.')[1], 10);
            if (actualNum !== parseInt(verseNum, 10)) {
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

    const chapterNumber = chapterNum ? Number.parseInt(chapterNum, 10) : Number.NaN;
    const verseNumber = verseNum ? Number.parseInt(verseNum, 10) : Number.NaN;
    const hasExtraSegment = Boolean(extraPath?.trim());
    const verseData = chapterNum && verseNum && !hasExtraSegment ? getVerseInRange(chapterNum, verseNum) : null;
    const currentChapter = allChapters && Number.isFinite(chapterNumber) ? allChapters[chapterNumber] : null;
    const currentIndex = currentChapter && verseData ? currentChapter.sutras.findIndex((sutra) => sutra.id === verseData.id) : -1;
    const invalidRouteReason = !chapterNum || !verseNum
        ? 'Missing chapter or verse.'
        : hasExtraSegment
          ? 'This route has extra path segments.'
          : !Number.isFinite(chapterNumber) || !Number.isFinite(verseNumber)
            ? 'Chapter and verse numbers are invalid.'
            : !currentChapter
              ? `Chapter ${chapterNum} is not available.`
              : !verseData
                ? `Sutra ${verseNum} is not available in Chapter ${chapterNum}.`
                : null;

    const { handlePrev, handleNext } = useSutraNavigation(allChapters, chapterNum, currentIndex);

    if (error && allChapters === null) {
        return (
            <div className="flex min-h-full items-center justify-center px-4">
                <Seo title="Unable to load sutra" description={SITE_DESCRIPTION} canonicalPath="/" noIndex />
                <div className={routeStateCardClassName} role="alert">
                    <h1 className="mb-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">Unable to load this sutra</h1>
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

    if (loading && allChapters === null) {
        return (
            <div className="flex min-h-full items-center justify-center px-4">
                <Seo title="Loading sutra" description={SITE_DESCRIPTION} canonicalPath="/" noIndex />
                <div className={routeStateCardClassName} role="status" aria-live="polite">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold-primary/15 bg-gold-surface/70 dark:border-dark-border/60 dark:bg-dark-surface">
                        <div className="h-6 w-6 animate-spin rounded-full border-4 border-gold-primary border-t-transparent" />
                    </div>
                    <h1 className="mb-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">Loading sutra</h1>
                    <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                        Preparing the reading surface and commentary.
                    </p>
                </div>
            </div>
        );
    }

    if (invalidRouteReason) {
        return (
            <div className="flex min-h-full items-center justify-center px-4">
                <Seo title="Sutra not found" description={SITE_DESCRIPTION} canonicalPath="/" noIndex />
                <div className={routeStateCardClassName} role="alert">
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">Invalid route</p>
                    <h1 className="mb-2 font-display text-2xl text-text-primary dark:text-dark-text-primary">Sutra not found</h1>
                    <p className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">{invalidRouteReason}</p>
                    <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="app-button-primary px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-dark-bg"
                        >
                            Browse chapters
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/chapter/1/verse/1')}
                            className="app-button-secondary px-5 py-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-dark-bg"
                        >
                            Open Chapter 1
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!verseData || !currentChapter) {
        return null;
    }

    const safeChapterNum = chapterNum as string;
    const safeVerseNum = verseNum as string;
    const safeVerseData = verseData;
    const safeCurrentChapter = currentChapter;
    const pageTitle = `Chapter ${safeChapterNum}, Sutra ${safeVerseNum}`;

    const audioSrc = `/mp3/${safeChapterNum}-${safeVerseData.id.split('.')[1]}.mp3`;
    const bodyContentClassName = isCommentaryMode ? 'hidden' : 'space-y-5 sm:space-y-6';
    const navigationDisabledClassName = 'pointer-events-none opacity-25';
    const bodyNavigationRailClassName =
        'pointer-events-none hidden lg:sticky lg:top-[calc(50dvh-1.375rem)] lg:z-20 lg:h-0 lg:w-full lg:flex lg:items-center lg:justify-between';

    return (
        <AnimatePresence mode="wait">
            <Seo
                title={pageTitle}
                description={`${SITE_DESCRIPTION} Read Chapter ${safeChapterNum}, Sutra ${safeVerseNum} with audio, translations, and commentary.`}
                canonicalPath={`/chapter/${safeChapterNum}/verse/${safeVerseNum}`}
            />
            <motion.div
                key={`${safeChapterNum}-${safeVerseNum}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="min-h-full flex flex-col justify-start py-4 text-text-primary transition-colors duration-500 dark:text-dark-text-primary sm:py-6 lg:justify-center"
            >
                <div className="mx-auto flex w-full max-w-[60rem] flex-col gap-5 px-4 sm:gap-7 sm:px-6 lg:max-w-[62rem] lg:px-8">
                    {!isCommentaryMode ? (
                        <motion.div variants={itemVariants}>
                            <div className="relative mx-auto w-full max-w-[58rem] overflow-visible px-4 sm:px-6 lg:px-8">
                                <section className={`${sharedContentShellClassName} ${sharedContentPaddingClassName}`}>
                                    <div className={bodyContentClassName}>
                                        <motion.div variants={itemVariants}>
                                            <SutraContent sanskrit={safeVerseData.sanskrit} pronunciation={safeVerseData.pronunciation} pronunciationKr={safeVerseData.pronunciation_kr} />
                                        </motion.div>

                                        <motion.div variants={itemVariants}>
                                            <WordMeanings meanings={safeVerseData.word_meanings} />
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
                                                baeJik={safeVerseData['5.bae_jik']}
                                                baeUu={safeVerseData['6.bae_uu']}
                                                oxfordKr={safeVerseData['8. ox']}
                                                oxfordEn={safeVerseData['9. ox-en']}
                                            />
                                        </motion.div>
                                    </div>
                                </section>
                                <div className={bodyNavigationRailClassName}>
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        disabled={parseInt(safeChapterNum, 10) === 1 && currentIndex === 0}
                                        aria-label="\uC774\uC804 \uAD6C\uC808"
                                        className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-gold-primary/18 bg-white/60 text-[#5B7282] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85 hover:text-[#31404b] active:scale-95 dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                                            parseInt(safeChapterNum, 10) === 1 && currentIndex === 0 ? navigationDisabledClassName : ''
                                        } -translate-x-[calc(100%+1rem)]`}
                                    >
                                        <ChevronLeft className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={parseInt(safeChapterNum, 10) === 4 && currentIndex === safeCurrentChapter.sutras.length - 1}
                                        aria-label="\uB2E4\uC74C \uAD6C\uC808"
                                        className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-gold-primary/18 bg-white/60 text-[#5B7282] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85 hover:text-[#31404b] active:scale-95 dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                                            parseInt(safeChapterNum, 10) === 4 && currentIndex === safeCurrentChapter.sutras.length - 1 ? navigationDisabledClassName : ''
                                        } translate-x-[calc(100%+1rem)]`}
                                    >
                                        <ChevronRight className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    ) : null}

                    {isCommentaryMode ? (
                        <motion.div variants={itemVariants}>
                            <div className="relative mx-auto w-full max-w-[58rem] overflow-visible px-4 sm:px-6 lg:px-8">
                                <CommentaryContent chapterNum={String(safeCurrentChapter.chapter)} verseNum={safeVerseData.id.split('.')[1]} />

                                <div className="pointer-events-none absolute inset-y-0 left-0 hidden -translate-x-[calc(100%+1rem)] items-center lg:flex">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        disabled={parseInt(safeChapterNum, 10) === 1 && currentIndex === 0}
                                        aria-label="\uC774\uC804 \uAD6C\uC808"
                                        className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-gold-primary/18 bg-white/60 text-[#5B7282] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85 hover:text-[#31404b] active:scale-95 dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                                            parseInt(safeChapterNum, 10) === 1 && currentIndex === 0 ? navigationDisabledClassName : ''
                                        }`}
                                    >
                                        <ChevronLeft className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                                    </button>
                                </div>

                                <div className="pointer-events-none absolute inset-y-0 right-0 hidden translate-x-[calc(100%+1rem)] items-center lg:flex">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={parseInt(safeChapterNum, 10) === 4 && currentIndex === safeCurrentChapter.sutras.length - 1}
                                        aria-label="\uB2E4\uC74C \uAD6C\uC808"
                                        className={`pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-gold-primary/18 bg-white/60 text-[#5B7282] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/85 hover:text-[#31404b] active:scale-95 dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                                            parseInt(safeChapterNum, 10) === 4 && currentIndex === safeCurrentChapter.sutras.length - 1 ? navigationDisabledClassName : ''
                                        }`}
                                    >
                                        <ChevronRight className="h-5 w-5 stroke-[1.5]" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : null}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerseView;
