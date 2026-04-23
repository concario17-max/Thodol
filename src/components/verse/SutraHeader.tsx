import { BookOpenText } from 'lucide-react';

interface SutraHeaderProps {
    chapterNum: string;
    chapterTitle: string;
    verseRange: string;
}

export const SutraHeader = ({ chapterNum, chapterTitle, verseRange }: SutraHeaderProps) => (
    <header className="flex items-start justify-between gap-4 rounded-[24px] border border-gold-border/30 bg-white/70 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm dark:border-dark-border/40 dark:bg-dark-surface/70">
        <div className="min-w-0">
            <p className="font-inter text-[11px] uppercase tracking-[0.24em] text-text-secondary dark:text-dark-text-secondary">Chapter {chapterNum}</p>
            <h2 className="mt-1 break-keep font-display text-lg font-semibold leading-snug text-text-primary dark:text-dark-text-primary">{chapterTitle}</h2>
            <p className="mt-1 font-inter text-sm text-text-secondary dark:text-dark-text-secondary">Sutra {verseRange}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-border/20 text-gold-primary dark:bg-gold-border/10">
            <BookOpenText className="h-5 w-5" />
        </div>
    </header>
);
