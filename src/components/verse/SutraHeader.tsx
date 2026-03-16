import { Link } from 'react-router-dom';

interface SutraHeaderProps {
    chapterNum: string;
    verseRange: string;
}

export const SutraHeader = ({ chapterNum, verseRange }: SutraHeaderProps) => (
    <div className="flex flex-col items-center justify-center mb-1 pt-2">
        <nav className="flex items-center gap-2 text-[12px] text-text-secondary dark:text-dark-text-secondary font-inter mb-4">
            <Link to="/" className="hover:text-gold-primary dark:hover:text-gold-light transition-colors">
                Chapter {chapterNum}
            </Link>
            <span>›</span>
            <span className="text-text-primary dark:text-dark-text-primary font-bold">Sutra {verseRange}</span>
        </nav>

        <div className="w-8 h-8 rounded-full bg-gold-border/20 flex items-center justify-center mb-2 text-gold-primary">
            <span className="font-serif leading-none">ॐ</span>
        </div>
    </div>
);
