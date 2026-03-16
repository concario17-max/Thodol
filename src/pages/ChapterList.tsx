import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Variants, motion } from 'framer-motion';
import { Target, Zap, Sparkles, Cloud } from 'lucide-react';
import { YOGA_CHAPTERS_META } from '../constants';
import { fetchYogaData } from '../utils/dataFetcher';
import { YogaChapter } from '../types';
import { GlassCard } from '../components/ui/GlassCard';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));
const ReflectionsModal = lazy(() => import('../components/ReflectionsModal'));

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
            return <span className="font-serif text-xl">ॐ</span>;
    }
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: 'easeOut',
        },
    },
};

const ChapterList = () => {
    const navigate = useNavigate();
    const [chapters, setChapters] = useState<YogaChapter[]>([]);
    const [isCompendiumOpen, setIsCompendiumOpen] = useState<boolean>(false);
    const [isLexiconOpen, setIsLexiconOpen] = useState<boolean>(false);
    const [isReflectionsOpen, setIsReflectionsOpen] = useState<boolean>(false);
    const [selectedChapter, setSelectedChapter] = useState<string>('');
    const [selectedVerse, setSelectedVerse] = useState<string>('');

    useEffect(() => {
        fetchYogaData()
            .then((data) => {
                if (data && typeof data === 'object') {
                    setChapters(Object.values(data) as YogaChapter[]);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6 transition-colors duration-500 md:py-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mb-8 flex flex-col items-center text-center md:mb-10"
            >
                <motion.div
                    variants={itemVariants}
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-gold-border bg-gold-surface/50 dark:border-dark-border dark:bg-dark-surface"
                >
                    <span className="font-serif text-xl leading-none text-gold-primary opacity-80">ॐ</span>
                </motion.div>
                <motion.h1
                    variants={itemVariants}
                    className="mb-4 font-display text-4xl font-light tracking-[0.25em] text-text-primary drop-shadow-sm dark:text-dark-text-primary sm:text-5xl md:text-[53px]"
                >
                    YOGA SUTRAS
                </motion.h1>
                <motion.p
                    variants={itemVariants}
                    className="mb-12 font-display text-sm italic tracking-widest text-gold-primary dark:text-gold-light md:text-base"
                >
                    The Light of Yoga
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="mb-8 flex flex-wrap items-center justify-center gap-1 text-[11px] font-display uppercase tracking-[0.2em] text-text-secondary sm:gap-6"
                >
                    <span
                        onClick={() => setIsCompendiumOpen(true)}
                        className="cursor-pointer rounded-full bg-transparent px-3 py-2 transition-colors hover:bg-gold-surface/30 hover:text-gold-primary active:scale-95"
                    >
                        Compendium
                    </span>
                    <div className="h-1 w-1 rotate-45 bg-gold-border/50" />
                    <span
                        onClick={() => setIsLexiconOpen(true)}
                        className="cursor-pointer rounded-full bg-transparent px-3 py-2 transition-colors hover:bg-gold-surface/30 hover:text-gold-primary active:scale-95"
                    >
                        Lexicon
                    </span>
                    <div className="hidden h-1 w-1 rotate-45 bg-gold-border/50 sm:block" />
                    <span
                        onClick={() => setIsReflectionsOpen(true)}
                        className="cursor-pointer rounded-full bg-transparent px-3 py-2 transition-colors hover:bg-gold-surface/30 hover:text-gold-primary active:scale-95"
                    >
                        Commentaries
                    </span>
                </motion.div>

                <motion.div variants={itemVariants} className="mx-auto mb-10 flex w-full max-w-md items-center justify-center opacity-40">
                    <div className="h-px flex-1 bg-gold-border" />
                    <div className="mx-4 font-serif text-lg leading-none text-gold-primary">•</div>
                    <div className="h-px flex-1 bg-gold-border" />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="relative z-10 mx-auto mb-5 flex w-full max-w-2xl flex-col items-center justify-between gap-3 rounded-2xl border border-gold-border/40 bg-white/80 p-2.5 shadow-xl shadow-gold-primary/5 backdrop-blur-md dark:bg-dark-surface/80 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] sm:flex-row sm:gap-0 sm:p-3"
                >
                    <div className="flex w-full flex-1 flex-col items-start border-b border-gold-border/30 px-2 pb-2 sm:border-b-0 sm:border-r sm:px-4 sm:pb-0">
                        <span className="mb-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-gold-primary drop-shadow-sm">Chapter</span>
                        <select
                            className="w-full appearance-none bg-transparent font-display text-sm font-medium text-text-primary outline-none transition-colors focus:text-gold-primary dark:text-dark-text-primary"
                            value={selectedChapter}
                            onChange={(e) => {
                                setSelectedChapter(e.target.value);
                                setSelectedVerse('');
                            }}
                        >
                            <option value="">Select Chapter</option>
                            {chapters.map((chapter) => (
                                <option key={chapter.chapter} value={chapter.chapter} className="text-base">
                                    Chapter {chapter.chapter}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex w-full flex-1 flex-col items-start px-2 pt-0.5 sm:px-6 sm:pt-0">
                        <span className="mb-0.5 text-[9px] font-black uppercase tracking-[0.2em] text-gold-primary drop-shadow-sm">Verse</span>
                        <select
                            className="w-full appearance-none bg-transparent font-display text-sm font-medium text-text-primary outline-none transition-colors focus:text-gold-primary disabled:opacity-50 dark:text-dark-text-primary"
                            value={selectedVerse}
                            disabled={!selectedChapter}
                            onChange={(e) => {
                                const verse = e.target.value;
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
                                        const sutraNum = sutra.id.split('.')[1];
                                        return (
                                            <option key={sutra.id} value={sutraNum} className="text-base">
                                                Sutra {sutraNum}
                                            </option>
                                        );
                                    })}
                        </select>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 pb-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
            >
                {chapters.map((chapter) => {
                    const chapterInfo = YOGA_CHAPTERS_META[chapter.chapter];

                    return (
                        <motion.div key={chapter.chapter} variants={itemVariants}>
                            <GlassCard
                                href={`/chapter/${chapter.chapter}/verse/1`}
                                icon={getChapterIcon(chapter.chapter)}
                                subtitle={`CHAPTER ${chapter.chapter}`}
                                title={
                                    <>
                                        <span className="font-crimson text-xl md:text-2xl">
                                            {chapterInfo?.name_english || chapter.meta?.name_english || ''}
                                        </span>
                                        <span className="mt-1 font-noto-kr text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                            {chapterInfo?.name_korean || chapter.meta?.name_korean || ''}
                                        </span>
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
                {isReflectionsOpen && <ReflectionsModal isOpen={isReflectionsOpen} onClose={() => setIsReflectionsOpen(false)} />}
            </Suspense>
        </div>
    );
};

export default ChapterList;
