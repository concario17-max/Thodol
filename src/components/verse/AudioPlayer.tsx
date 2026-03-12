import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
    isPlaying: boolean;
    togglePlay: () => void;
    currentTime: number;
    duration: number;
    progressPercent: number;
    formatTime: (time: number) => string;
    onSeek: (percentage: number) => void;
}

export const AudioPlayer = ({
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    progressPercent,
    formatTime,
    onSeek
}: AudioPlayerProps) => (
    <div className="mb-10 flex justify-center">
        <div className="flex items-center justify-between w-full max-w-[400px] rounded-full border border-gold-primary/20 dark:border-dark-border/50 bg-white/40 dark:bg-[#111]/40 backdrop-blur-md px-5 py-2.5 shadow-sm hover:shadow-md transition-all hover:border-gold-primary/40">
            <button
                onClick={togglePlay}
                className="text-gold-primary dark:text-gold-light hover:scale-110 transition-transform"
            >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums ml-4">
                {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 mx-4 h-[2px] bg-gold-border/30 dark:bg-dark-border rounded-full cursor-pointer group"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    onSeek(x / rect.width);
                }}>
                <div
                    className="absolute top-0 left-0 h-full bg-[#A68B5C] transition-all"
                    style={{ width: `${progressPercent}%` }}
                ></div>
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-[#A68B5C] rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progressPercent}% - 4px)` }}
                ></div>
            </div>

            <span className="text-[10px] text-text-secondary/50 font-inter font-bold tracking-widest tabular-nums">
                {formatTime(duration)}
            </span>
        </div>
    </div>
);
