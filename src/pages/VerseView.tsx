import { useRef, useEffect } from 'react';
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
import { motion, AnimatePresence, Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: 0.3 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

const VerseView = () => {
    const { chapterNum, verseNum } = useParams<{ chapterNum: string; verseNum: string }>();
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement>(null);

    const { 
        allChapters, 
        loading, 
        getVerseInRange, 
        getVerseRangeText 
    } = useYogaData();

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
        progressPercent
    } = useAudio(audioRef);

    // Initial load and URL sync
    useEffect(() => {
        if (!chapterNum || !verseNum || !allChapters) return;

        const verseData = getVerseInRange(chapterNum, verseNum);
        if (verseData) {
            const actualNum = parseInt(verseData.id.split('.')[1], 10);
            if (actualNum !== parseInt(verseNum)) {
                navigate(`/chapter/${chapterNum}/verse/${actualNum}`, { replace: true });
            }
        }
    }, [chapterNum, verseNum, allChapters, getVerseInRange, navigate]);

    // Reset audio and scroll to top on navigation
    useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo(0, 0);
        }
        reset();
    }, [chapterNum, verseNum, reset]);

    // Calculate index and get navigation hook at top level to satisfy Rules of Hooks
    const verseData = (chapterNum && verseNum) ? getVerseInRange(chapterNum, verseNum) : null;
    const currentChapter = (allChapters && chapterNum) ? allChapters[parseInt(chapterNum)] : null;
    const currentIndex = (currentChapter && verseData) 
        ? currentChapter.sutras.findIndex(s => s.id === verseData.id) 
        : -1;
    
    const { handlePrev, handleNext } = useSutraNavigation(allChapters, chapterNum, currentIndex);

    if (loading || !allChapters || !chapterNum || !verseNum) {
        return (
            <div className="min-h-full flex items-center justify-center bg-gold-bg dark:bg-dark-bg">
                <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!verseData || !currentChapter) return null;

    const verseRange = getVerseRangeText(currentChapter, verseData);
    const audioSrc = `/mp3/${chapterNum}-${verseData.id.split('.')[1]}.mp3`;

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key={`${chapterNum}-${verseNum}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                className="min-h-full flex flex-col justify-center font-display text-text-primary dark:text-dark-text-primary transition-colors duration-500 py-6"
            >
                <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6 space-y-12">
                    <motion.div variants={itemVariants}>
                        <SutraHeader chapterNum={chapterNum} verseRange={verseRange} />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <SutraContent 
                            sanskrit={verseData.sanskrit}
                            pronunciation={verseData.pronunciation}
                            pronunciationKr={verseData.pronunciation_kr}
                        />
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
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <TranslationSection 
                            english={verseData['2.english']}
                            korean1={verseData['3.korean-1']}
                            baeJik={verseData['5.bae_jik']}
                            baeUu={verseData['6.bae_uu']}
                            oxfordKr={verseData['8. ox']}
                            oxfordEn={verseData['9. ox-en']}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <SutraNavigation 
                            chapterNum={chapterNum}
                            verseRange={verseRange}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            isPrevDisabled={parseInt(chapterNum) === 1 && currentIndex === 0}
                            isNextDisabled={parseInt(chapterNum) === 4 && currentIndex === currentChapter.sutras.length - 1}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default VerseView;
