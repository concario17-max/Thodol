import { useEffect, useRef } from 'react';
import { AudioPlayer } from '../verse/AudioPlayer';
import { useAudio } from '../../hooks/useAudio';
import type { AlbumData, AlbumTrack } from '../../data/albums';

interface AlbumPlayerProps {
    album: AlbumData;
    track: AlbumTrack | null;
}

export const AlbumPlayer = ({ album, track }: AlbumPlayerProps) => {
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

    useEffect(() => {
        reset();
    }, [reset, track?.id, track?.url]);

    if (!track) {
        return (
            <div className="rounded-[1.6rem] border border-dashed border-gold-border/18 bg-white/50 px-4 py-5 text-sm leading-relaxed text-text-secondary dark:border-dark-border/55 dark:bg-[#111]/30 dark:text-dark-text-secondary">
                트랙을 고르면 재생기가 여기에 나타난다.
            </div>
        );
    }

    return (
        <section className="rounded-[1.6rem] border border-gold-border/12 bg-white/62 px-4 py-4 shadow-[0_14px_34px_-30px_rgba(0,0,0,0.35)] dark:border-dark-border/55 dark:bg-[#111]/40">
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-gold-border/8 pb-3 dark:border-dark-border/35">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
                        현재 재생
                    </p>
                    <h3 className="mt-2 line-clamp-2 font-display text-lg text-text-primary dark:text-dark-text-primary">
                        {track.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-secondary dark:text-dark-text-secondary">
                        {album.title}
                    </p>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={track.url}
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
        </section>
    );
};
