import { useGlobalAudio } from '../../context/AudioContext';
import type { AlbumData, AlbumTrack } from '../../data/albums';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

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
        playAlbumTrack,
        albumVolume,
        albumPlaybackRate,
        setAlbumVolume,
        setAlbumPlaybackRate,
        currentTrack,
        currentAlbum,
    } = useGlobalAudio();

    const [prevVolume, setPrevVolume] = useState(1.0);
    const isThisTrackActive = currentTrack?.id === track?.id && currentAlbum?.id === album.id;

    const formatTime = (time: number) => {
        if (Number.isNaN(time)) {
            return '0:00';
        }
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // 네이티브 range input을 오버레이 방식으로 도입했으므로 기존 클릭 처리 함수는 불필요하여 제거함

    if (!track) {
        return (
            <div className="rounded-[1.3rem] border border-dashed border-gold-border/18 bg-white/50 px-4 py-5 text-sm leading-relaxed text-text-secondary dark:border-dark-border/55 dark:bg-[#111]/30 dark:text-dark-text-secondary">
                트랙을 고르면 재생기가 여기에 나타난다.
            </div>
        );
    }

    const currentIdx = album.tracks.findIndex((t) => t.id === track.id);
    const hasPrev = currentIdx > 0;
    const hasNext = currentIdx < album.tracks.length - 1;

    const handlePrev = () => {
        if (hasPrev) {
            void playAlbumTrack(album, album.tracks[currentIdx - 1]);
        }
    };

    const handleNext = () => {
        if (hasNext) {
            void playAlbumTrack(album, album.tracks[currentIdx + 1]);
        }
    };

    const toggleMute = () => {
        if (albumVolume > 0) {
            setPrevVolume(albumVolume);
            setAlbumVolume(0);
        } else {
            setAlbumVolume(prevVolume || 1.0);
        }
    };

    const speeds = [0.8, 1.0, 1.25, 1.5];
    const rotateSpeed = () => {
        const nextIdx = (speeds.indexOf(albumPlaybackRate) + 1) % speeds.length;
        setAlbumPlaybackRate(speeds[nextIdx]);
    };

    return (
        <section className="rounded-[1.3rem] border border-gold-border/10 bg-gold-primary/[0.03] dark:bg-gold-light/[0.02] px-5 py-4 dark:border-dark-border/35">
            {/* 상단 앨범 정보 및 LP 회전 아트 */}
            <div className="flex flex-col items-center text-center gap-3 pb-3.5 border-b border-gold-border/8 dark:border-dark-border/30">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-gold-border/15 shadow-lg dark:border-dark-border/40">
                    {isAlbumPlaying && isThisTrackActive ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 15 / albumPlaybackRate, ease: 'linear' }}
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
                    <div className="absolute inset-0 m-auto h-6 w-6 rounded-full border border-white/20 bg-[#111]/90 shadow-inner" />
                </div>

                <div className="min-w-0 w-full">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-gold-primary/70 dark:text-gold-light/70">
                        현재 재생 중
                    </p>
                    <h3 className="mt-1 line-clamp-1 font-display text-lg text-text-primary dark:text-dark-text-primary">
                        {track.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-text-secondary/70 dark:text-dark-text-secondary/60">
                        {album.artist} • {album.title}
                    </p>
                </div>
            </div>

            {/* 재생 프로그레스 슬라이더 */}
            <div className="mt-4 flex flex-col gap-1.5">
                <div className="group relative h-1.5 w-full rounded-full bg-gold-border/30 dark:bg-dark-border">
                    {/* 재생 진행바 시각 요소 */}
                    <div
                        className="absolute left-0 top-0 h-full rounded-full bg-gold-primary dark:bg-gold-light pointer-events-none"
                        style={{ width: `${isThisTrackActive ? albumProgress : 0}%` }}
                    />
                    {/* 진행바 핸들 조절기 시각 요소 */}
                    <div
                        className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-gold-primary dark:bg-gold-light shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{ left: `calc(${isThisTrackActive ? albumProgress : 0}% - 7px)` }}
                    />
                    {/* 네이티브 range input 투명 오버레이: 웹접근성 및 완벽한 드래그/클릭 터치 감도 보장 */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={isThisTrackActive ? albumProgress : 0}
                        onChange={(e) => {
                            if (!isThisTrackActive) return;
                            const percentage = parseFloat(e.target.value) / 100;
                            seekAlbum(percentage);
                        }}
                        disabled={!isThisTrackActive}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                        aria-label="재생 진행률 조절"
                    />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono font-semibold text-text-secondary/55">
                    <span>{formatTime(isThisTrackActive ? albumCurrentTime : 0)}</span>
                    <span>{formatTime(isThisTrackActive ? albumDuration : 0)}</span>
                </div>
            </div>

            {/* 주요 오디오 컨트롤 조작 그룹 */}
            <div className="mt-3.5 flex items-center justify-center gap-6">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!hasPrev}
                    className={`transition-transform hover:scale-105 active:scale-95 ${hasPrev ? 'text-text-primary dark:text-dark-text-primary' : 'text-text-secondary/30 dark:text-dark-text-secondary/30'}`}
                >
                    <SkipBack className="h-5 w-5 fill-current" />
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (!isThisTrackActive) {
                            void playAlbumTrack(album, track);
                        } else {
                            void toggleAlbumPlay();
                        }
                    }}
                    className="grid h-12 w-12 place-items-center rounded-full bg-gold-primary text-white shadow-md transition-transform hover:scale-105 active:scale-95 dark:bg-gold-light dark:text-black"
                >
                    {isAlbumPlaying && isThisTrackActive ? (
                        <Pause className="h-5 w-5 fill-current" />
                    ) : (
                        <Play className="h-5 w-5 fill-current translate-x-[1.5px]" />
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={!hasNext}
                    className={`transition-transform hover:scale-105 active:scale-95 ${hasNext ? 'text-text-primary dark:text-dark-text-primary' : 'text-text-secondary/30 dark:text-dark-text-secondary/30'}`}
                >
                    <SkipForward className="h-5 w-5 fill-current" />
                </button>
            </div>

            {/* 유틸리티 컨트롤 그룹 (볼륨, 배속) */}
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-gold-border/8 pt-3 dark:border-dark-border/30">
                {/* 배속 조절 토글 */}
                <button
                    type="button"
                    onClick={rotateSpeed}
                    className="rounded-md border border-gold-border/14 bg-white/40 dark:border-dark-border/40 dark:bg-white/5 px-2 py-1 text-[10px] font-mono font-semibold tracking-wider text-text-secondary dark:text-dark-text-secondary hover:bg-gold-primary/5 hover:text-gold-primary transition-all"
                >
                    {albumPlaybackRate.toFixed(2)}x
                </button>

                {/* 볼륨 컨트롤 */}
                <div className="flex items-center gap-2 flex-1 max-w-[120px]">
                    <button
                        type="button"
                        onClick={toggleMute}
                        className="text-text-secondary hover:text-gold-primary transition-colors"
                    >
                        {albumVolume === 0 ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={albumVolume}
                        onChange={(e) => setAlbumVolume(parseFloat(e.target.value))}
                        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-gold-border/30 accent-gold-primary dark:bg-dark-border dark:accent-gold-light"
                    />
                </div>
            </div>

            {albumPlaybackError && (
                <p className="mt-2 text-center text-xs text-gold-primary/80 dark:text-gold-light/80">
                    {albumPlaybackError}
                </p>
            )}
        </section>
    );
};
