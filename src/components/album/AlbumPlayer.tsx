import { useGlobalAudio } from '../../context/AudioContext';
import { AudioPlayer } from '../verse/AudioPlayer';
import type { AlbumData, AlbumTrack } from '../../data/albums';
import { motion } from 'framer-motion';

interface AlbumPlayerProps {
    album: AlbumData;
    track: AlbumTrack | null;
}

export const AlbumPlayer = ({ album, track }: AlbumPlayerProps) => {
    const {
        isAlbumPlaying,
        albumCurrentTime,
        albumDuration,
        albumPlaybackError,
        toggleAlbumPlay,
        seekAlbum,
        albumProgress,
    } = useGlobalAudio();

    const formatTime = (time: number) => {
        if (Number.isNaN(time)) {
            return '0:00';
        }
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!track) {
        return (
            <div className="rounded-[1.6rem] border border-dashed border-gold-border/18 bg-white/50 px-4 py-5 text-sm leading-relaxed text-text-secondary dark:border-dark-border/55 dark:bg-[#111]/30 dark:text-dark-text-secondary">
                트랙을 고르면 재생기가 여기에 나타난다.
            </div>
        );
    }

    return (
        <section className="rounded-[1.3rem] border border-gold-border/10 bg-gold-primary/[0.03] dark:bg-gold-light/[0.02] px-4 py-4 dark:border-dark-border/35">
            <div className="mb-4 flex items-center gap-4 border-b border-gold-border/8 pb-3 dark:border-dark-border/30">
                {/* 회전하는 LP 커버 이미지 */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gold-border/15 shadow-md dark:border-dark-border/40">
                    {isAlbumPlaying ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                            className="h-full w-full"
                        >
                            <img
                                src={album.coverImage}
                                alt="Vinyl cover"
                                className="h-full w-full object-cover"
                            />
                        </motion.div>
                    ) : (
                        <img
                            src={album.coverImage}
                            alt="Vinyl cover"
                            className="h-full w-full object-cover"
                        />
                    )}
                    {/* 중심 홀 디자인 */}
                    <div className="absolute inset-0 m-auto h-4 w-4 rounded-full border border-white/20 bg-[#111]/90 shadow-inner" />
                </div>

                <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
                        현재 재생
                    </p>
                    <h3 className="mt-1 line-clamp-1 font-display text-base text-text-primary dark:text-dark-text-primary">
                        {track.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-text-secondary dark:text-dark-text-secondary">
                        {album.title}
                    </p>
                </div>
            </div>

            <AudioPlayer
                isPlaying={isAlbumPlaying}
                togglePlay={toggleAlbumPlay}
                currentTime={albumCurrentTime}
                duration={albumDuration}
                progressPercent={albumProgress}
                formatTime={formatTime}
                onSeek={seekAlbum}
                playbackError={albumPlaybackError}
            />
        </section>
    );
};
