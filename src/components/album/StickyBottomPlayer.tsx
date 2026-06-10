import { useGlobalAudio } from '../../context/AudioContext';
import { Play, Pause, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const StickyBottomPlayer = () => {
    const location = useLocation();
    const {
        currentAlbum,
        currentTrack,
        isAlbumPlaying,
        toggleAlbumPlay,
        albumProgress,
    } = useGlobalAudio();

    const isAlbumPage = location.pathname === '/albums';

    // 재생 중이거나 선택된 트랙이 없으면 렌더링 배제
    if (!currentTrack || !currentAlbum) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className={`fixed bottom-4 left-4 right-4 z-50 overflow-hidden rounded-[1.6rem] border border-gold-border/20 bg-white/94 p-3 shadow-[0_24px_54px_-14px_rgba(0,0,0,0.38)] backdrop-blur-md dark:border-dark-border/60 dark:bg-[#13100d]/94 md:bottom-6 md:right-6 md:left-auto md:w-80 md:rounded-[1.4rem] md:shadow-[0_20px_48px_-16px_rgba(0,0,0,0.3)] ${
                    isAlbumPage ? 'md:hidden' : ''
                }`}
            >
                {/* 하단 밀착 진행 바 */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-primary/10 dark:bg-gold-light/10">
                    <div
                        className="h-full bg-gold-primary transition-all duration-100 ease-out dark:bg-gold-light"
                        style={{ width: `${albumProgress}%` }}
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* 미니 앨범 커버 */}
                    <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[1rem] border border-gold-border/12 bg-neutral-100 dark:border-dark-border/40">
                        {isAlbumPlaying ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                                className="h-full w-full"
                            >
                                <img
                                    src={currentAlbum.coverImage}
                                    alt="Mini cover"
                                    className="h-full w-full object-cover"
                                />
                            </motion.div>
                        ) : (
                            <img
                                src={currentAlbum.coverImage}
                                alt="Mini cover"
                                className="h-full w-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 grid place-items-center bg-black/10">
                            <Disc3 className="h-4 w-4 animate-spin text-white/50" style={{ animationDuration: '6s' }} />
                        </div>
                    </div>

                    {/* 트랙 메타 정보 */}
                    <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-semibold text-text-primary dark:text-dark-text-primary">
                            {currentTrack.title}
                        </h4>
                        <p className="truncate text-[10px] text-text-secondary/80 dark:text-dark-text-secondary/70">
                            {currentAlbum.title} • {currentAlbum.artist}
                        </p>
                    </div>

                    {/* 재생 및 일시정지 제어 단추 */}
                    <button
                        type="button"
                        onClick={() => void toggleAlbumPlay()}
                        className="grid h-9 w-9 place-items-center rounded-full bg-gold-primary text-white shadow-sm transition-transform active:scale-95 dark:bg-gold-light dark:text-black"
                        aria-label={isAlbumPlaying ? '일시정지' : '재생'}
                    >
                        {isAlbumPlaying ? (
                            <Pause className="h-4 w-4 stroke-[2.5]" />
                        ) : (
                            <Play className="h-4 w-4 fill-current stroke-[2.5] translate-x-[1px]" />
                        )}
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
