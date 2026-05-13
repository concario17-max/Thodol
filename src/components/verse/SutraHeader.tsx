import { BookOpenText } from 'lucide-react';

export const SutraHeader = () => (
    <header className="rounded-[1.2rem] border border-gold-border/16 bg-white/72 px-4 py-4 shadow-[0_18px_38px_-34px_rgba(0,0,0,0.35)] dark:border-dark-border/50 dark:bg-dark-surface/58 sm:px-5">
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-border/20 bg-white/80 text-gold-primary shadow-[0_8px_24px_rgba(0,0,0,0.05)] dark:border-dark-border/45 dark:bg-dark-bg/70">
                <BookOpenText className="h-5 w-5" />
            </div>

            <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-gold-primary/80 dark:text-gold-light/80">
                    Reading
                </p>
                <p className="mt-1 font-display text-[18px] font-semibold tracking-[0.06em] text-text-primary dark:text-dark-text-primary sm:text-[20px]">
                    Sutra view
                </p>
            </div>
        </div>
    </header>
);
