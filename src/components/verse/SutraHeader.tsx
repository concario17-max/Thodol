import { BookOpenText } from 'lucide-react';

export const SutraHeader = () => (
    <header className="flex items-center justify-center py-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-border/30 bg-white/70 text-gold-primary shadow-[0_8px_24px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:border-dark-border/40 dark:bg-dark-surface/70">
            <BookOpenText className="h-5 w-5" />
        </div>
    </header>
);
