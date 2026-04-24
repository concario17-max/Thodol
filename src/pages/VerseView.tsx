import { useRef, useEffect, type CSSProperties } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYogaData } from '../hooks/useYogaData';
import { useAudio } from '../hooks/useAudio';
import { SutraHeader } from '../components/verse/SutraHeader';
import { SutraContent } from '../components/verse/SutraContent';
import { AudioPlayer } from '../components/verse/AudioPlayer';
import { TranslationSection } from '../components/verse/TranslationSection';
import { SutraNavigation } from '../components/verse/SutraNavigation';
import { WordMeanings } from '../components/verse/WordMeanings';
import { useSutraNavigation } from '../hooks/useSutraNavigation';
import { useUI } from '../context/UIContext';
import { chapter1Commentary, type CommentaryBlock } from '../data/chapter1Commentary';
import { chapter2Commentary } from '../data/chapter2Commentary';
import { chapter3Commentary } from '../data/chapter3Commentary';
import { chapter4Commentary } from '../data/chapter4Commentary';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.3 },
    },
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

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
        <div className="overflow-hidden rounded-xl border border-gold-border/20 bg-white/75 dark:border-dark-border/50 dark:bg-dark-bg/60">
            <div className="grid border-b border-gold-border/20 bg-gold-surface/40 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-primary dark:bg-dark-surface/80 dark:text-gold-light" style={gridStyle}>
                {Array.from({ length: columnCount }).map((_, index) => (
                    <div key={`${table.headers[index] ?? 'header'}-${index}`} className={`px-3 py-2 ${index > 0 ? 'border-l border-gold-border/20 dark:border-dark-border/50' : ''}`}>
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
                                className={`px-3 py-3 text-sm leading-relaxed ${cellIndex > 0 ? 'border-l border-gold-border/10 dark:border-dark-border/40' : ''} ${cellIndex === 0 ? 'font-medium text-text-primary dark:text-dark-text-primary' : 'text-text-secondary dark:text-dark-text-secondary'}`}
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
    <section key={block.title} className="space-y-3 rounded-2xl border border-gold-border/20 bg-white/65 p-4 dark:border-dark-border/50 dark:bg-dark-surface/55">
        <h3 className="text-sm font-semibold text-[#1C2B36] dark:text-dark-text-primary">{block.title}</h3>

        {block.paragraphs?.map((paragraph, index) => (
            <p key={`${block.title}-p-${index}`} className="text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {paragraph}
            </p>
        ))}

        {block.table ? renderTable(block.table) : null}

        {block.bullets ? (
            <ul className="space-y-2 text-sm leading-relaxed text-text-secondary dark:text-dark-text-secondary">
                {block.bullets.map((item, index) => {
                    const match = item.match(/^(\d+)\.\s+(.*)$/);
                    const marker = match ? `${match[1]}.` : '•';
                    const text = match ? match[2] : item;

                    return (
                        <li key={`${block.title}-b-${index}`} className="flex rounded-xl border border-gold-border/20 bg-white/60 px-3 py-2.5 dark:bg-dark-surface/60">
                            <span className="mr-2 shrink-0 font-semibold text-[#1C2B36] dark:text-dark-text-primary">{marker}</span>
                            <span className="min-w-0 flex-1 break-words">{text}</span>
                        </li>
                    );
                })}
            </ul>
        ) : null}
    </section>
);

const CommentaryContent = ({ chapterNum, verseNum }: { chapterNum: string; verseNum: string }) => {
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

    return (
        <section className="mx-auto w-full max-w-3xl space-y-5 px-4 sm:space-y-6 sm:px-6 lg:max-w-[52rem] lg:px-8">
            {inlineHeading ? <h2 className="text-2xl font-semibold leading-tight text-text-primary dark:text-dark-text-primary">{inlineHeading}</h2> : null}

            {bodyBlocks && bodyBlocks.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">{bodyBlocks.map(renderCommentaryBlock)}</div>
            ) : (
                <div className="rounded-2xl border border-gold-border/20 bg-white/65 p-5 text-sm leading-relaxed text-text-secondary dark:border-dark-border/50 dark:bg-dark-surface/55 dark:text-dark-text-secondary">
                    아직 코멘터리가 없습니다.
                </div>
            )}
        </section>
    );
};

const VerseView = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement>(null);
    const { activeVerseContentMode } = useUI();
    const isCommentaryMode = activeVerseContentMode === 'commentary';

    const { allChapters, loading, error, getVerseInRange, getVerseRangeLabel } = useYogaData();

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
                <div className="max-w-lg rounded-2xl border border-gold-border/30 bg-white/75 p-6 text-center shadow-lg backdrop-blur-sm dark:bg-dark-surface/75">
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

    const verseRange = getVerseRangeLabel(currentChapter, verseData);
    const audioSrc = `/mp3/${chapterNum}-${verseData.id.split('.')[1]}.mp3`;
    const bodyContentClassName = isCommentaryMode ? 'hidden' : 'space-y-5 sm:space-y-6';

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${chapterNum}-${verseNum}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="min-h-full flex flex-col justify-center font-display text-text-primary transition-colors duration-500 dark:text-dark-text-primary py-4 sm:py-6"
            >
                <div className="mx-auto w-full max-w-[1180px] space-y-8 px-4 sm:space-y-12 sm:px-6 lg:max-w-none lg:px-8">
                    <motion.div variants={itemVariants}>
                        <SutraHeader />
                    </motion.div>

                    <section className={bodyContentClassName}>
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
                    </section>

                    {isCommentaryMode ? (
                        <motion.div variants={itemVariants}>
                            <CommentaryContent chapterNum={String(currentChapter.chapter)} verseNum={verseData.id.split('.')[1]} />
                        </motion.div>
                    ) : null}

                    <motion.div variants={itemVariants}>
                        <SutraNavigation
                            chapterNum={chapterNum}
                            verseRange={verseRange}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            isPrevDisabled={parseInt(chapterNum, 10) === 1 && currentIndex === 0}
                            isNextDisabled={parseInt(chapterNum, 10) === 4 && currentIndex === currentChapter.sutras.length - 1}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerseView;
