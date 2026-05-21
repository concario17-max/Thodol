import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SutraNavigationProps {
    chapterNum: string;
    verseRange: string;
    onPrev: () => void;
    onNext: () => void;
    isPrevDisabled: boolean;
    isNextDisabled: boolean;
}

const navButtonClass =
    'grid h-11 w-11 place-items-center rounded-full border border-gold-border/12 bg-shell-main/72 text-text-secondary shadow-[0_12px_28px_-24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-shell-main/90 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-30 active:scale-95 dark:border-dark-border/70 dark:bg-shell-main-dark/72 dark:text-dark-text-secondary dark:hover:bg-white/6 dark:hover:text-dark-text-primary';

export const SutraNavigation = ({ chapterNum, verseRange, onPrev, onNext, isPrevDisabled, isNextDisabled }: SutraNavigationProps) => (
    <div className="mt-10 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] font-sans sm:px-0 sm:pb-8">
        <div className="mx-auto w-full max-w-[62rem]">
            <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4">
                <div className="flex justify-start">
                    <button
                        onClick={onPrev}
                        disabled={isPrevDisabled}
                        className={navButtonClass}
                        aria-label="Previous verse"
                    >
                        <ChevronLeft className="h-5 w-5 stroke-[1.5]" />
                    </button>
                </div>

                <span className="rounded-full border border-gold-border/12 bg-shell-main/78 px-5 py-2 text-[15px] font-semibold tracking-[0.08em] text-text-primary shadow-[0_12px_28px_-24px_rgba(0,0,0,0.38)] backdrop-blur-md dark:border-dark-border/70 dark:bg-shell-main-dark/72 dark:text-dark-text-primary">
                    {chapterNum}.{verseRange}
                </span>

                <div className="flex justify-end">
                    <button
                        onClick={onNext}
                        disabled={isNextDisabled}
                        className={navButtonClass}
                        aria-label="Next verse"
                    >
                        <ChevronRight className="h-5 w-5 stroke-[1.5]" />
                    </button>
                </div>
            </div>
        </div>
    </div>
);
