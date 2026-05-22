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
    'app-icon-button grid text-text-secondary disabled:cursor-not-allowed disabled:opacity-30 dark:text-dark-text-secondary';

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

                <span className="app-panel-card rounded-full px-5 py-2 text-[15px] font-semibold tracking-[0.08em] text-text-primary dark:text-dark-text-primary">
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
