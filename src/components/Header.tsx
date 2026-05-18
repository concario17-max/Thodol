import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText } from 'lucide-react';

interface HeaderProps {
    title?: ReactNode;
    targetUrl?: string;
    selectionControls?: ReactNode;
    className?: string;
}

const Header = ({ title = 'Yoga Sutras', targetUrl = '/', selectionControls, className = '' }: HeaderProps) => {
    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-border/10 bg-shell-header shadow-none transition-colors duration-500 backdrop-blur-0 dark:border-dark-border/60 dark:bg-shell-header-dark ${className}`}>
            <div className="container mx-auto max-w-7xl px-4 py-2 sm:px-5 lg:hidden">
                <div className="flex min-w-0 items-center gap-2 text-text-primary dark:text-dark-text-primary">
                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-2 truncate">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 truncate font-display text-[16px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                    </Link>
                    {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                </div>
            </div>

            <div className="hidden h-12 w-full items-center lg:flex">
                <div className="container mx-auto flex max-w-7xl min-w-0 items-center gap-3 px-5">
                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-2 truncate text-text-primary dark:text-dark-text-primary">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-6 w-6" />
                        </span>
                        <span className="truncate font-display text-[20px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                    </Link>
                    {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                </div>
            </div>
        </header>
    );
};

export default Header;
