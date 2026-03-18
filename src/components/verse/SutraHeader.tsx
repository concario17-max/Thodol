import { BookOpenText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SutraHeaderProps {
    chapterNum: string;
    verseRange: string;
}

export const SutraHeader = ({ chapterNum, verseRange }: SutraHeaderProps) => (
    <div className="mb-1 flex flex-col items-center justify-center pt-2">
        <nav className="mb-4 flex items-center gap-2 font-inter text-[12px] text-text-secondary dark:text-dark-text-secondary">
            <Link to="/" className="transition-colors hover:text-gold-primary dark:hover:text-gold-light">
                Chapter {chapterNum}
            </Link>
            <span>/</span>
            <span className="font-bold text-text-primary dark:text-dark-text-primary">Sutra {verseRange}</span>
        </nav>

        <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold-border/20 text-gold-primary">
            <BookOpenText className="h-4 w-4" />
        </div>
    </div>
);
