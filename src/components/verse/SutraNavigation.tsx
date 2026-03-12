import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SutraNavigationProps {
    chapterNum: string;
    verseRange: string;
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

export const SutraNavigation = ({
    chapterNum,
    verseRange,
    onPrev,
    onNext,
    isPrevDisabled,
    isNextDisabled
}: SutraNavigationProps) => (
    <div className="mt-10 pb-4 flex justify-center font-inter">
        <div className="flex items-center justify-between bg-white/40 dark:bg-dark-surface/40 backdrop-blur-md border border-gold-primary/20 dark:border-dark-border/50 rounded-full px-3 py-1.5 shadow-sm min-w-[180px] hover:shadow-md transition-shadow">
            <button
                onClick={onPrev}
                disabled={isPrevDisabled}
                className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
            >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
            </button>

            <span className="text-[15px] font-bold text-[#1C2B36] dark:text-dark-text-primary tracking-wide px-4">
                {chapterNum}.{verseRange}
            </span>

            <button
                onClick={onNext}
                disabled={isNextDisabled}
                className="p-2 rounded-full hover:bg-gold-surface/50 dark:hover:bg-[#222] transition-colors disabled:opacity-30 disabled:cursor-not-allowed group text-[#5B7282] dark:text-dark-text-secondary"
            >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[1.5]" />
            </button>
        </div>
    </div>
);
