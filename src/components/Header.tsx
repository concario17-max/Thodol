import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { getDesktopVerseColumns } from './ui/desktopVerseLayout';

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
    const { activeVerseContentMode, isDesktopSidebarOpen, setActiveVerseContentMode } = useUI();
    const desktopGridStyle = showSidebarToggle
        ? ({ '--desktop-verse-columns': getDesktopVerseColumns(isDesktopSidebarOpen, false) } as CSSProperties)
        : undefined;

    const renderVerseModeToggle = () =>
        showSidebarToggle ? (
            <div className="inline-flex items-center rounded-full border border-gold-border/14 bg-shell-main/80 p-1 backdrop-blur-sm dark:border-dark-border/70 dark:bg-shell-main-dark/82">
                {[
                    { mode: 'body' as const, label: 'Body' },
                    { mode: 'commentary' as const, label: 'Commentary' },
                ].map((option) => {
                    const isActive = activeVerseContentMode === option.mode;

                    return (
                        <button
                            key={option.mode}
                            type="button"
                            onClick={() => setActiveVerseContentMode(option.mode)}
                            aria-pressed={isActive}
                            className={`min-w-[4.4rem] rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] transition-all duration-300 sm:text-[11px] ${
                                isActive
                                    ? 'bg-gold-primary text-white shadow-[0_6px_16px_-8px_rgba(166,139,92,0.95)] dark:bg-gold-light dark:text-[#2a2116]'
                                    : 'text-gold-primary hover:bg-gold-surface/70 dark:text-gold-light dark:hover:bg-white/6'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        ) : null;

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
                </div>

                <div className="mt-2 flex w-full flex-col gap-2 border-t border-gold-border/10 pt-2 dark:border-dark-border/50">
                    {selectionControls ? <div className="min-w-0">{selectionControls}</div> : null}

                    <div className="flex flex-wrap items-center gap-2">
                        {rightContent}
                        <div className="ml-auto flex items-center gap-2">
                            {renderVerseModeToggle()}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`hidden h-12 w-full items-center lg:grid ${
                    showSidebarToggle ? 'lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:grid-cols-1'
                }`}
                style={desktopGridStyle}
            >
                <div className="flex min-w-0 items-center px-5">
                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-2 truncate text-text-primary dark:text-dark-text-primary">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-6 w-6" />
                        </span>
                        <span className="truncate font-display text-[20px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="flex min-w-0 items-center justify-end gap-3 px-5">
                    <div className="flex items-center gap-2 rounded-full border border-gold-border/10 bg-shell-main/78 p-1 backdrop-blur-sm dark:border-dark-border/60 dark:bg-shell-main-dark/80">
                        {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                        {rightContent}
                        {renderVerseModeToggle()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
