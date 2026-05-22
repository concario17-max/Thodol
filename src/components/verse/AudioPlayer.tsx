import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
    isPlaying: boolean;
    togglePlay: () => Promise<void>;
    currentTime: number;
    duration: number;
    progressPercent: number;
    formatTime: (time: number) => string;
    onSeek: (percentage: number) => void;
    playbackError?: string | null;
}

export const AudioPlayer = ({
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    progressPercent,
    formatTime,
    onSeek,
    playbackError,
}: AudioPlayerProps) => (
    <div className="mx-auto mb-10 flex w-full max-w-[52rem] flex-col items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex w-full items-center justify-between rounded-full border border-gold-primary/20 bg-white/40 px-5 py-2.5 shadow-sm transition-all hover:border-gold-primary/40 hover:shadow-md dark:border-dark-border/50 dark:bg-[#111]/40 dark:hover:border-gold-primary/30">
            <button
                type="button"
                onClick={() => {
                    void togglePlay();
                }}
                className="text-gold-primary dark:text-gold-light hover:scale-110 transition-transform"
            >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <span className="ml-4 font-inter text-[10px] font-bold tracking-widest text-text-secondary/50 tabular-nums">
                {formatTime(currentTime)}
            </span>

            <div className="group relative mx-4 h-[2px] flex-1 cursor-pointer rounded-full bg-gold-border/30 dark:bg-dark-border"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    onSeek(x / rect.width);
                }}>
                <div
                    className="absolute left-0 top-0 h-full bg-[#A68B5C] transition-all"
                    style={{ width: `${progressPercent}%` }}
                ></div>
                <div
                    className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[#A68B5C] opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    style={{ left: `calc(${progressPercent}% - 4px)` }}
                ></div>
            </div>

            <span className="font-inter text-[10px] font-bold tracking-widest text-text-secondary/50 tabular-nums">
                {formatTime(duration)}
            </span>
        </div>
        {playbackError && <p className="text-center text-xs text-gold-primary/80 dark:text-gold-light/80">{playbackError}</p>}
    </div>
);
