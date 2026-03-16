import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { YOGA_CHAPTERS_META } from '../constants';
import { fetchYogaData } from '../utils/dataFetcher';
import { YogaChapter } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { Variants, motion } from 'framer-motion';
import { Target, Zap, Sparkles, Cloud } from 'lucide-react';

const CompendiumModal = lazy(() => import('../components/CompendiumModal'));
const LexiconModal = lazy(() => import('../components/LexiconModal'));
const ReflectionsModal = lazy(() => import('../components/ReflectionsModal'));

const getChapterIcon = (chapter: number) => {
    switch (chapter) {
        case 1: return <Target className="w-5 h-5" />;
        case 2: return <Zap className="w-5 h-5" />;
        case 3: return <Sparkles className="w-5 h-5" />;
        case 4: return <Cloud className="w-5 h-5" />;
        default: return <span className="text-xl font-serif">֍</span>;
    }
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
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
            .then(data => {
                if (data && typeof data === 'object') {
                    const chapterArray = Object.values(data) as YogaChapter[];
                    setChapters(chapterArray);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <div className="container mx-auto max-w-6xl px-4 py-6 md:py-8 transition-colors duration-500">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="text-center mb-8 md:mb-10 flex flex-col items-center"
            >
                <motion.div variants={itemVariants} className="w-10 h-10 flex items-center justify-center rounded-full bg-gold-surface/50 dark:bg-dark-surface border border-gold-border dark:border-dark-border mb-4">
                    <span className="text-xl font-serif leading-none opacity-80 text-gold-primary">֍</span>
                </motion.div>
                <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-[53px] tracking-[0.25em] font-crimson text-text-primary dark:text-dark-text-primary mb-4 drop-shadow-sm font-light">
                    YOGA SUTRAS
                </motion.h1>
                <motion.p variants={itemVariants} className="text-sm md:text-base text-gold-primary dark:text-gold-light italic font-crimson tracking-widest mb-12">
                    The Light of Yoga
                </motion.p>

                <motion.div variants={itemVariants} className="flex items-center gap-1 sm:gap-6 text-[11px] font-crimson tracking-[0.2em] text-text-secondary uppercase mb-8 flex-wrap justify-center">
                    <span
                        onClick={() => setIsCompendiumOpen(true)}
                        className="hover:text-gold-primary cursor-pointer transition-colors px-3 py-2 bg-transparent hover:bg-gold-surface/30 rounded-full active:scale-95"
                    >
                        Compendium
                    </span>
                    <div className="w-1 h-1 rotate-45 bg-gold-border/50"></div>
                    <span
                        onClick={() => setIsLexiconOpen(true)}
                        className="hover:text-gold-primary cursor-pointer transition-colors px-3 py-2 bg-transparent hover:bg-gold-surface/30 rounded-full active:scale-95"
                    >
                        Lexicon
                    </span>
                    <div className="w-1 h-1 rotate-45 bg-gold-border/50 hidden sm:block"></div>
                    <span
                        onClick={() => setIsReflectionsOpen(true)}
                        className="hover:text-gold-primary cursor-pointer transition-colors px-3 py-2 bg-transparent hover:bg-gold-surface/30 rounded-full active:scale-95"
                    >
                        Commentaries
                    </span>
                </motion.div>

                <motion.div variants={itemVariants} className="flex items-center justify-center w-full max-w-md mx-auto mb-10 opacity-40">
                    <div className="flex-1 h-px bg-gold-border"></div>
                    <div className="mx-4 text-gold-primary text-lg font-serif leading-none">❦</div>
                    <div className="flex-1 h-px bg-gold-border"></div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-white/80 dark:bg-dark-surface/80 backdrop-blur-md border border-gold-border/40 rounded-2xl shadow-xl shadow-gold-primary/5 dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] p-2.5 sm:p-3 mb-5 relative z-10 w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                    <div className="flex-1 w-full flex flex-col items-start px-2 sm:px-4 border-b sm:border-b-0 sm:border-r border-gold-border/30 pb-2 sm:pb-0">
                        <span className="text-[9px] font-black text-gold-primary tracking-[0.2em] uppercase mb-0.5 drop-shadow-sm">CHAPTER</span>
                        <select
                            className="text-sm font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary transition-colors focus:text-gold-primary"
                            value={selectedChapter}
                            onChange={(e) => {
                                const ch = e.target.value;
                                setSelectedChapter(ch);
                                setSelectedVerse(''); // Reset verse when chapter changes
                            }}
                        >
                            <option value="">Select Chapter</option>
                            {chapters.map(ch => (
                                <option key={ch.chapter} value={ch.chapter} className="text-base">Chapter {ch.chapter}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex-1 w-full flex flex-col items-start px-2 sm:px-6 pt-0.5 sm:pt-0">
                        <span className="text-[9px] font-black text-gold-primary tracking-[0.2em] uppercase mb-0.5 drop-shadow-sm">VERSE</span>
                        <select
                            className="text-sm font-crimson font-medium text-text-primary bg-transparent outline-none w-full cursor-pointer appearance-none dark:text-dark-text-primary transition-colors focus:text-gold-primary disabled:opacity-50"
                            value={selectedVerse}
                            disabled={!selectedChapter}
                            onChange={(e) => {
                                const v = e.target.value;
                                setSelectedVerse(v);
                                if (selectedChapter && v) {
                                    navigate(`/chapter/${selectedChapter}/verse/${v}`);
                                }
                            }}
                        >
                            <option value="">{selectedChapter ? "Select Sutra" : "Select Chapter First"}</option>
                            {selectedChapter && chapters.find(c => c.chapter === parseInt(selectedChapter))?.sutras.map(s => {
                                const sNum = s.id.split('.')[1];
                                return (
                                    <option key={s.id} value={sNum} className="text-base">Sutra {sNum}</option>
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto px-4 relative z-10 pb-12"
            >
                {chapters.map((ch) => {
                    const chapterInfo = YOGA_CHAPTERS_META[ch.chapter];
                    return (
                        <motion.div key={ch.chapter} variants={itemVariants}>
                            <GlassCard
                                href={`/chapter/${ch.chapter}/verse/1`}
                                icon={getChapterIcon(ch.chapter)}
                                subtitle={`CHAPTER ${ch.chapter}`}
                                title={
                                    (() => {
                                        const title = chapterInfo?.name_english || ch.meta?.name_english || "";
                                        const titleKr = chapterInfo?.name_korean || ch.meta?.name_korean || "";
                                        return (
                                            <>
                                                <span className="text-xl md:text-2xl font-crimson">{title}</span>
                                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary font-noto-kr font-medium mt-1">
                                                    {titleKr}
                                                </span>
                                            </>
                                        );
                                    })()
                                }
                                description={chapterInfo?.description || "Read sutras of this part."}
                            />
                        </motion.div>
                    );
                })}
            </motion.div>

            <Suspense fallback={null}>
                {isCompendiumOpen && (
                    <CompendiumModal
                        isOpen={isCompendiumOpen}
                        onClose={() => setIsCompendiumOpen(false)}
                    />
                )}
                {isLexiconOpen && (
                    <LexiconModal
                        isOpen={isLexiconOpen}
                        onClose={() => setIsLexiconOpen(false)}
                    />
                )}
                {isReflectionsOpen && (
                    <ReflectionsModal
                        isOpen={isReflectionsOpen}
                        onClose={() => setIsReflectionsOpen(false)}
                    />
                )}
            </Suspense>
        </div>
    );
};

export default ChapterList;
