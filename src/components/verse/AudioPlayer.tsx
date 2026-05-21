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

const SEEK_STEP = 0.05;

export const AudioPlayer = ({
    isPlaying,
    togglePlay,
    currentTime,
    duration,
    progressPercent,
    formatTime,
    onSeek,
    playbackError,
}: AudioPlayerProps) => {
    const handleSeekKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (duration <= 0) {
            return;
        }

        const currentPercent = progressPercent / 100;

        switch (event.key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                event.preventDefault();
                onSeek(Math.max(0, currentPercent - SEEK_STEP));
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                event.preventDefault();
                onSeek(Math.min(1, currentPercent + SEEK_STEP));
                break;
            case 'Home':
                event.preventDefault();
                onSeek(0);
                break;
            case 'End':
                event.preventDefault();
                onSeek(1);
                break;
            default:
                break;
        }
    };

    return (
        <div className="mb-10 flex flex-col items-center gap-3">
            <div className="flex w-full max-w-[400px] items-center justify-between rounded-full border border-gold-border/12 bg-shell-main/72 px-5 py-2.5 shadow-[0_14px_30px_-26px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-gold-primary/25 hover:shadow-[0_18px_34px_-26px_rgba(0,0,0,0.4)] dark:border-dark-border/70 dark:bg-shell-main-dark/70 dark:hover:border-gold-primary/25 lg:max-w-[720px]">
                <button
                    type="button"
                    onClick={() => {
                        void togglePlay();
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold-border/12 bg-shell-main/80 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-surface/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:border-dark-border/70 dark:bg-shell-main-dark/80 dark:text-gold-light dark:hover:bg-white/6 dark:focus-visible:ring-offset-shell-main-dark"
                    aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                    aria-pressed={isPlaying}
                >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                </button>

                <span className="ml-4 font-sans text-[10px] font-semibold tracking-[0.22em] tabular-nums text-text-secondary/55 dark:text-dark-text-secondary/55">
                    {formatTime(currentTime)}
                </span>

                <div
                    className="group relative mx-4 h-[2px] flex-1 cursor-pointer rounded-full bg-gold-border/30 dark:bg-dark-border"
                    role="slider"
                    tabIndex={0}
                    aria-label="Playback position"
                    aria-valuemin={0}
                    aria-valuemax={duration}
                    aria-valuenow={currentTime}
                    aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        onSeek(x / rect.width);
                    }}
                    onKeyDown={handleSeekKeyDown}
                >
                    <div className="absolute left-0 top-0 h-full bg-gold-primary transition-all dark:bg-gold-light" style={{ width: `${progressPercent}%` }} />
                    <div
                        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gold-primary shadow-sm opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gold-light"
                        style={{ left: `calc(${progressPercent}% - 4px)` }}
                    />
                </div>

                <span className="font-sans text-[10px] font-semibold tracking-[0.22em] tabular-nums text-text-secondary/55 dark:text-dark-text-secondary/55">
                    {formatTime(duration)}
                </span>
            </div>
            {playbackError && <p className="text-center text-xs text-gold-primary/80 dark:text-gold-light/80">{playbackError}</p>}
        </div>
    );
};
