import { Play, Pause } from 'lucide-react';
import { useAudioTime } from '../../context/AudioContext';

interface AudioPlayerProps {
    isPlaying: boolean;
    togglePlay: () => Promise<void>;
    onSeek: (percentage: number) => void;
    playbackError?: string | null;
}

export const AudioPlayer = ({
    isPlaying,
    togglePlay,
    onSeek,
    playbackError,
}: AudioPlayerProps) => {
    // 경전 전용 오디오 시간 정보 구독
    const { currentTime, duration, progress } = useAudioTime('sutra');

    const formatTime = (time: number) => {
        if (Number.isNaN(time)) {
            return '0:00';
        }
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="mx-auto mb-0 flex w-full flex-col items-center gap-2 px-0">
            <div className="flex w-full items-center justify-between gap-4 border-0 bg-transparent px-1 py-1.5 shadow-none transition-all">
                <button
                    type="button"
                    onClick={() => {
                        void togglePlay();
                    }}
                    className="shrink-0 text-gold-primary transition-transform hover:scale-105 dark:text-gold-light"
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <span className="ml-2 shrink-0 text-[10px] font-inter font-bold tracking-widest tabular-nums text-text-secondary/55">
                    {formatTime(currentTime)}
                </span>

                <div className="group relative mx-2 h-2 flex-1 rounded-full bg-gold-border/30 dark:bg-dark-border">
                    {/* 재생 진행바 시각 요소 */}
                    <div
                        className="absolute left-0 top-0 h-full rounded-full bg-[#A68B5C] pointer-events-none"
                        style={{ width: `${progress}%` }}
                    />
                    {/* 진행바 핸들 조절기 시각 요소 */}
                    <div
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#A68B5C] shadow-sm opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none"
                        style={{ left: `calc(${progress}% - 4px)` }}
                    />
                    {/* 네이티브 range input 투명 오버레이: 웹접근성 및 완벽한 드래그/클릭 터치 감도 보장 */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="0.1"
                        value={progress}
                        onChange={(e) => {
                            const percentage = parseFloat(e.target.value) / 100;
                            onSeek(percentage);
                        }}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
                        aria-label="경전 재생 진행률 조절"
                    />
                </div>

                <span className="shrink-0 text-[10px] font-inter font-bold tracking-widest tabular-nums text-text-secondary/55">
                    {formatTime(duration)}
                </span>
            </div>
            {playbackError && <p className="text-center text-xs text-gold-primary/80 dark:text-gold-light/80">{playbackError}</p>}
        </div>
    );
};
