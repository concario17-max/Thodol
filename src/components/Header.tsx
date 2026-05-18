import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText } from 'lucide-react';

interface HeaderProps {
    title?: ReactNode;
    targetUrl?: string;
    showSidebarToggle?: boolean;
    selectionControls?: ReactNode;
    rightContent?: ReactNode;
    className?: string;
}

const Header = ({
    title = 'Yoga Sutras',
    targetUrl = '/',
    showSidebarToggle = false,
    selectionControls,
    rightContent,
    className = '',
}: HeaderProps) => {
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

                <div className="mt-2 flex w-full items-center gap-2 border-t border-gold-border/10 pt-2 dark:border-dark-border/50">
                    <div className="min-w-0 flex-1">{rightContent}</div>
                </div>
            </div>

            <div className={`hidden h-12 w-full items-center ${showSidebarToggle ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_auto]' : 'lg:grid lg:grid-cols-1'}`}>
                <div className="flex min-w-0 items-center gap-3 px-5">
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

                <div className="flex min-w-0 items-center justify-end gap-3 px-5">{rightContent}</div>
            </div>
        </header>
    );
};

export default Header;
