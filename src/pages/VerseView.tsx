import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useYogaData } from '../hooks/useYogaData';
import { useAudio } from '../hooks/useAudio';
import { SutraHeader } from '../components/verse/SutraHeader';
import { SutraContent } from '../components/verse/SutraContent';
import { AudioPlayer } from '../components/verse/AudioPlayer';
import { TranslationSection } from '../components/verse/TranslationSection';
import { SutraNavigation } from '../components/verse/SutraNavigation';

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

    // Reset audio on navigation
    useEffect(() => {
        window.scrollTo(0, 0);
        reset();
    }, [chapterNum, verseNum, reset]);

    if (loading || !allChapters || !chapterNum || !verseNum) {
        return (
            <div className="min-h-full flex items-center justify-center bg-gold-bg dark:bg-dark-bg">
                <div className="w-8 h-8 border-4 border-gold-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const verseData = getVerseInRange(chapterNum, verseNum);
    if (!verseData) return null;

    const currentChapter = allChapters[parseInt(chapterNum)];
    const currentIndex = currentChapter.sutras.findIndex(s => s.id === verseData.id);
    const verseRange = getVerseRangeText(currentChapter, verseData);
    const audioSrc = `/mp3/${chapterNum}-${verseData.id.split('.')[1]}.mp3`;

    // Navigation handlers
    const handlePrev = () => {
        const currentC = parseInt(chapterNum);
        if (currentIndex > 0) {
            navigate(`/chapter/${currentC}/verse/${currentChapter.sutras[currentIndex - 1].id.split('.')[1]}`);
        } else if (currentC > 1) {
            const prevChapter = allChapters[currentC - 1];
            if (prevChapter?.sutras.length) {
                navigate(`/chapter/${currentC - 1}/verse/${prevChapter.sutras[prevChapter.sutras.length - 1].id.split('.')[1]}`);
            }
        }
    };

    const handleNext = () => {
        const currentC = parseInt(chapterNum);
        if (currentIndex < currentChapter.sutras.length - 1) {
            navigate(`/chapter/${currentC}/verse/${currentChapter.sutras[currentIndex + 1].id.split('.')[1]}`);
        } else if (currentC < Object.keys(allChapters).length) {
            const nextChapter = allChapters[currentC + 1];
            if (nextChapter?.sutras.length) {
                navigate(`/chapter/${currentC + 1}/verse/${nextChapter.sutras[0].id.split('.')[1]}`);
            }
        }
    };

    return (
        <div className="min-h-full flex flex-col justify-center font-crimson text-text-primary dark:text-dark-text-primary transition-colors duration-500 py-6">
            <div className="mx-auto w-full max-w-[1000px] px-4 sm:px-6">
                <SutraHeader chapterNum={chapterNum} verseRange={verseRange} />

                <SutraContent 
                    sanskrit={verseData.sanskrit}
                    pronunciation={verseData.pronunciation}
                    pronunciationKr={verseData.pronunciation_kr}
                />

                <audio
                    ref={audioRef}
                    src={audioSrc}
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
                />

                <TranslationSection 
                    english={verseData['2.english']}
                    korean1={verseData['3.korean-1']}
                    baeJik={verseData['5.bae_jik']}
                    baeUu={verseData['6.bae_uu']}
                    oxfordKr={verseData['8. ox']}
                    oxfordEn={verseData['9. ox-en']}
                />

                <SutraNavigation 
                    chapterNum={chapterNum}
                    verseRange={verseRange}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    isPrevDisabled={parseInt(chapterNum) === 1 && currentIndex === 0}
                    isNextDisabled={parseInt(chapterNum) === 4 && currentIndex === currentChapter.sutras.length - 1}
                />
            </div>
        </div>
    );
};

export default VerseView;
