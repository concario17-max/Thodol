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
    isNextDisabled,
}: SutraNavigationProps) => (
    <div className="mt-10 pb-[calc(1.5rem+env(safe-area-inset-bottom))] px-4 font-inter sm:pb-8 sm:px-0">
        <div className="mx-auto w-full">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
                <div className="flex justify-start">
                    <button
                        onClick={onPrev}
                        disabled={isPrevDisabled}
                        className="grid h-11 w-11 place-items-center rounded-full border border-gold-primary/18 bg-white/55 text-[#5B7282] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:text-[#31404b] disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary"
                        aria-label="Previous verse"
                    >
                        <ChevronLeft className="h-5 w-5 stroke-[1.5]" />
                    </button>
                </div>

                <span className="rounded-full border border-gold-primary/14 bg-white/65 px-5 py-2 text-[15px] font-semibold tracking-[0.08em] text-[#1C2B36] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.38)] backdrop-blur-md dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-primary">
                    {chapterNum}.{verseRange}
                </span>

                <div className="flex justify-end">
                    <button
                        onClick={onNext}
                        disabled={isNextDisabled}
                        className="grid h-11 w-11 place-items-center rounded-full border border-gold-primary/18 bg-white/55 text-[#5B7282] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/80 hover:text-[#31404b] disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:border-dark-border/55 dark:bg-dark-surface/55 dark:text-dark-text-secondary dark:hover:bg-[#1e1b17] dark:hover:text-dark-text-primary"
                        aria-label="Next verse"
                    >
                        <ChevronRight className="h-5 w-5 stroke-[1.5]" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);
