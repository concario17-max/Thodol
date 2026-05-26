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
import { chapter1Commentary, type CommentaryBlock } from '../data/chapter1Commentary';
import { chapter2Commentary } from '../data/chapter2Commentary';
import { chapter3Commentary } from '../data/chapter3Commentary';
import { chapter4Commentary } from '../data/chapter4Commentary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const learningComicImages = {
    ...import.meta.glob('../assets/learning-comic/chapter-1/*.png', {
        eager: true,
        import: 'default',
    }),
    ...import.meta.glob('../assets/learning-comic/chapter-2/*.png', {
        eager: true,
        import: 'default',
    }),
    ...import.meta.glob('../assets/learning-comic/chapter-3/*.png', {
        eager: true,
        import: 'default',
    }),
    ...import.meta.glob('../assets/learning-comic/chapter-4/*.png', {
        eager: true,
        import: 'default',
    }),
} as Record<string, string>;

const learningComicChapterPaths: Record<'1' | '2' | '3' | '4', string> = {
    1: '../assets/learning-comic/chapter-1',
    2: '../assets/learning-comic/chapter-2',
    3: '../assets/learning-comic/chapter-3',
    4: '../assets/learning-comic/chapter-4',
};

const getLearningComicImageUrl = (chapterNum: string, verseNum: string) => {
    if (chapterNum !== '1' && chapterNum !== '2' && chapterNum !== '3' && chapterNum !== '4') {
        return null;
    }

    const chapterPath = learningComicChapterPaths[chapterNum as '1' | '2' | '3' | '4'];

    return learningComicImages[`${chapterPath}/${verseNum}.png`] ?? null;
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
            <div className="grid border-b border-gold-border/12 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:text-gold-light" style={gridStyle}>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div key={`${table.headers[index] ?? 'header'}-${index}`} className={`px-4 py-2.5 ${index > 0 ? 'border-l border-gold-border/12 dark:border-dark-border/45' : ''}`}>
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
                                className={`px-4 py-3.5 text-[15px] leading-relaxed ${
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
    <section key={block.title} className="space-y-3 border-l border-gold-border/12 pl-5 dark:border-dark-border/45">
        <h3 className="font-sans text-[15px] font-semibold leading-snug tracking-[0.01em] text-text-primary dark:text-dark-text-primary sm:text-[16px]">
            {block.title}
        </h3>

        {block.paragraphs?.map((paragraph, index) => (
            <p key={`${block.title}-p-${index}`} className="font-sans text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">
                {paragraph}
            </p>
        ))}

        {block.table ? renderTable(block.table) : null}

        {block.bullets ? (
            <ul className="space-y-2 font-sans text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">
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

interface CommentaryContentProps {
    chapterNum: string;
    verseNum: string;
    navigationControls?: React.ReactNode;
}

const CommentaryContent = ({ chapterNum, verseNum, navigationControls }: CommentaryContentProps) => {
    const [viewMode, setViewMode] = useState<CommentaryViewMode>('comic');

    useEffect(() => {
        setViewMode('comic');
    }, [chapterNum, verseNum]);

    const commentarySource: Record<string, CommentaryBlock[]> | null =
        chapterNum === '1'
            ? chapter1Commentary
            : chapterNum === '2'
                ? chapter2Commentary
                : chapterNum === '3'
                    ? chapter3Commentary
                    : chapterNum === '4'
                        ? chapter4Commentary
                        : null;
    const commentaryKey = chapterNum === '1' || chapterNum === '4' ? `${chapterNum}.${verseNum}` : verseNum;
    const commentaryBlocks = commentarySource?.[commentaryKey] ?? null;
    const inlineHeading = commentaryBlocks?.[0]?.title ?? null;
    const bodyBlocks = commentaryBlocks?.length ? commentaryBlocks.slice(1) : null;
    const learningComicImageUrl = getLearningComicImageUrl(chapterNum, verseNum);

    return (
        <section className="mx-auto w-full space-y-3 px-0 sm:space-y-4">
            <div className="flex items-center gap-2.5 border-b border-gold-border/8 pb-3 dark:border-dark-border/35">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
                    Commentary
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-gold-border/35 via-gold-border/15 to-transparent dark:from-dark-border/45 dark:via-dark-border/20" />
                {navigationControls ? <div className="min-w-0 shrink-0">{navigationControls}</div> : null}
                <button
                    type="button"
                    onClick={() => setViewMode((current) => (current === 'commentary' ? 'comic' : 'commentary'))}
                    aria-label={viewMode === 'commentary' ? '학습만화 보기' : '텍스트 해설 보기'}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-border/30 bg-shell-main/90 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform duration-200 hover:-translate-y-0.5 dark:border-dark-border/55 dark:bg-shell-main-dark/90 dark:text-gold-light"
                >
                    <SquareArrowOutUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>

            <div className={`${sharedContentShellClassName} ${sharedContentPaddingClassName} sm:space-y-5`}>
                {viewMode === 'commentary' ? (
                    <>
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="font-display text-[22px] font-semibold tracking-[0.06em] text-text-primary dark:text-dark-text-primary">
                                {chapterNum}.{verseNum}
                            </span>
                            {inlineHeading ? <span className="font-sans text-[16px] font-medium text-text-secondary dark:text-dark-text-secondary">{inlineHeading}</span> : null}
                        </div>

                        {bodyBlocks && bodyBlocks.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">{bodyBlocks.map(renderCommentaryBlock)}</div>
                        ) : (
                            <div className="border-l border-gold-border/12 pl-5 font-sans text-[15px] leading-8 text-text-secondary dark:border-dark-border/45 dark:text-dark-text-secondary sm:text-[16px]">
                                No commentary is available for this sutra.
                            </div>
                        )}
                    </>
                ) : learningComicImageUrl ? (
                    <div className="overflow-hidden rounded-[1.75rem] border border-gold-border/12 bg-[#fbf7ef] p-2 shadow-[0_18px_48px_-32px_rgba(0,0,0,0.28)] dark:border-dark-border/50 dark:bg-[#191714]">
                        <img
                            src={learningComicImageUrl}
                            alt={`학습만화 ${chapterNum}.${verseNum}`}
                            className="block h-auto w-full rounded-[1.15rem] object-contain"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div className="space-y-3 rounded-[1.5rem] border border-gold-border/12 bg-shell-main/85 p-5 text-sm leading-7 text-text-secondary dark:border-dark-border/45 dark:bg-shell-main-dark/85 dark:text-dark-text-secondary sm:p-6">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-primary/70 dark:text-gold-light/70">
                            Learning comic
                        </p>
                        <p>학습만화는 현재 chapter 1, 2, 3에만 이미지가 준비되어 있다.</p>
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

    const verseData = chapterNum && verseNum ? getVerseInRange(chapterNum, verseNum) : null;
    const currentChapter = allChapters && chapterNum ? allChapters[parseInt(chapterNum, 10)] : null;
    const currentIndex = currentChapter && verseData ? currentChapter.sutras.findIndex((sutra) => sutra.id === verseData.id) : -1;
    const { handlePrev, handleNext } = useSutraNavigation(allChapters, chapterNum, currentIndex);
    if (error) {
        return (
            <div className="flex min-h-full items-center justify-center px-6">
                <div className="max-w-lg text-center">
                    <h1 className="mb-3 font-display text-2xl text-text-primary dark:text-dark-text-primary">Unable to load this sutra</h1>
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

    const audioSrc = `/mp3/${chapterNum}-${verseData.id.split('.')[1]}.mp3`;
    const bodyContentClassName = isCommentaryMode ? 'hidden' : 'space-y-5 sm:space-y-6';
    const navigationDisabledClassName = 'pointer-events-none opacity-25';
    const rightPanelNavigationControls =
        currentIndex >= 0 ? (
            <div className="inline-flex items-center rounded-full border border-gold-border/14 bg-shell-main/80 p-0.5 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.35)] backdrop-blur-sm dark:border-dark-border/70 dark:bg-shell-main-dark/82">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={parseInt(chapterNum, 10) === 1 && currentIndex === 0}
                    aria-label="이전 구절"
                    className={`grid h-8 w-8 place-items-center rounded-full text-[#5B7282] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#31404b] disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                        parseInt(chapterNum, 10) === 1 && currentIndex === 0 ? navigationDisabledClassName : ''
                    }`}
                >
                    <ChevronLeft className="h-4 w-4 stroke-[1.5]" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={parseInt(chapterNum, 10) === 4 && currentIndex === currentChapter!.sutras.length - 1}
                    aria-label="다음 구절"
                    className={`grid h-8 w-8 place-items-center rounded-full text-[#5B7282] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#31404b] disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary ${
                        parseInt(chapterNum, 10) === 4 && currentIndex === currentChapter!.sutras.length - 1 ? navigationDisabledClassName : ''
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
                                            <SutraContent sanskrit={verseData.sanskrit} pronunciation={verseData.pronunciation} pronunciationKr={verseData.pronunciation_kr} />
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
                                                baeJik={verseData['5.bae_jik']}
                                                baeUu={verseData['6.bae_uu']}
                                                oxfordKr={verseData['8. ox']}
                                                oxfordEn={verseData['9. ox-en']}
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
                                    verseNum={verseData.id.split('.')[1]}
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
