import { AlbumPlayer } from './AlbumPlayer';
import type { AlbumData } from '../../data/albums';
import { Headphones, Music2, Disc3 } from 'lucide-react';
import { useGlobalAudio } from '../../context/AudioContext';
import { motion } from 'framer-motion';

interface AlbumDetailProps {
    album: AlbumData;
    selectedTrackId: string | null;
    onSelectTrack: (trackId: string) => void;
}

const PlayingWaveform = () => (
    <div className="flex items-end gap-[2.5px] h-3.5 w-3.5 shrink-0 justify-center">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{
                    height: [4, 14, 4],
                }}
                transition={{
                    duration: 0.85,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    delay: i * 0.15,
                    ease: 'easeInOut',
                }}
                className="w-[2.5px] bg-gold-primary dark:bg-gold-light rounded-full"
            />
        ))}
    </div>
);

export const AlbumDetail = ({ album, selectedTrackId, onSelectTrack }: AlbumDetailProps) => {
    const selectedTrack = album.tracks.find((track) => track.id === selectedTrackId) ?? album.tracks[0] ?? null;
    const { isAlbumPlaying, currentTrack } = useGlobalAudio();

    return (
        <section className="overflow-hidden rounded-[2.1rem] border border-gold-border/14 bg-[linear-gradient(180deg,rgba(255,252,246,0.94)_0%,rgba(252,248,239,0.9)_100%)] shadow-[0_24px_64px_-46px_rgba(0,0,0,0.45)] dark:border-dark-border/55 dark:bg-[linear-gradient(180deg,rgba(24,20,17,0.98)_0%,rgba(17,15,13,0.95)_100%)]">
            <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(240px,320px)_1fr] lg:gap-6 lg:p-6">
                <div className="flex flex-col gap-4">
                    <img
                        src={album.coverImage}
                        alt={`${album.title} cover`}
                        className="aspect-square w-full object-cover rounded-[1.5rem] shadow-[0_12px_32px_-12px_rgba(0,0,0,0.4)] dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.7)]"
                    />
                    <div className="hidden lg:block">
                        <AlbumPlayer album={album} track={selectedTrack} />
                    </div>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-primary/70 dark:text-gold-light/70">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-border/14 bg-white/72 px-3 py-1 dark:border-dark-border/45 dark:bg-white/5">
                                <Disc3 className="h-3.5 w-3.5" />
                                앨범
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-border/14 bg-white/72 px-3 py-1 dark:border-dark-border/45 dark:bg-white/5">
                                <Headphones className="h-3.5 w-3.5" />
                                {album.tracks.length} 트랙
                            </span>
                        </div>

                        <div className="space-y-2">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-text-secondary/65 dark:text-dark-text-secondary/65">
                                {album.artist}
                            </p>
                            <h2 className="font-display text-[clamp(1.5rem,3.5vw,2.4rem)] leading-[1.08] text-text-primary dark:text-dark-text-primary">
                                {album.title}
                            </h2>
                            <p className="max-w-3xl text-[15px] leading-8 text-text-secondary dark:text-dark-text-secondary sm:text-[16px]">
                                {album.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="border-0 bg-transparent p-1">
                            <div className="mb-4 flex items-center gap-2 px-1">
                                <Music2 className="h-4 w-4 text-gold-primary/70 dark:text-gold-light/70" />
                                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-text-secondary/75 dark:text-dark-text-secondary/75">
                                    트랙 목록
                                </h3>
                            </div>

                            <div className="divide-y divide-gold-border/8 dark:divide-dark-border/25">
                                {album.tracks.map((track, index) => {
                                    const isSelected = track.id === selectedTrack?.id;
                                    const isCurrentlyPlaying = isSelected && isAlbumPlaying && currentTrack?.id === track.id;
                                    const isThisTrackPaused = isSelected && !isAlbumPlaying && currentTrack?.id === track.id;
                                    const statusText = isCurrentlyPlaying ? '재생 중' : isThisTrackPaused ? '일시 정지됨' : '눌러서 재생';

                                    return (
                                        <button
                                            key={track.id}
                                            type="button"
                                            onClick={() => onSelectTrack(track.id)}
                                            className={`flex w-full items-center gap-3.5 border-l-[3px] py-3.5 px-3 text-left transition-all duration-300 rounded-r-xl rounded-l-none ${
                                                isSelected
                                                    ? 'border-l-gold-primary bg-gold-primary/8 dark:border-l-gold-light dark:bg-gold-light/8'
                                                    : 'border-l-transparent bg-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-primary/6 text-[10px] font-mono font-semibold text-gold-primary/70 dark:bg-white/5 dark:text-gold-light/70">
                                                {isCurrentlyPlaying ? (
                                                    <PlayingWaveform />
                                                ) : (
                                                    String(index + 1).padStart(2, '0')
                                                )}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-sm font-medium text-text-primary dark:text-dark-text-primary">
                                                    {track.title}
                                                </span>
                                                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-text-secondary/55 dark:text-dark-text-secondary/55">
                                                    {statusText}
                                                </span>
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 모바일 화면에서는 스티키 바와 별개로 상세 뷰 하단에도 플레이어를 내장 */}
                        <div className="mt-6 lg:hidden">
                            <AlbumPlayer album={album} track={selectedTrack} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
