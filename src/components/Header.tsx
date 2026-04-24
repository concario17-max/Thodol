import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ThemeToggle from './ThemeToggle';
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
            <div className="inline-flex items-center rounded-full border border-gold-primary/18 bg-white/78 p-1 shadow-[0_10px_24px_-20px_rgba(166,139,92,0.9)] backdrop-blur-sm dark:border-dark-border/70 dark:bg-dark-surface/80">
                {[
                    { mode: 'body' as const, label: '본문' },
                    { mode: 'commentary' as const, label: '해설' },
                ].map((option) => {
                    const isActive = activeVerseContentMode === option.mode;

                    return (
                        <button
                            key={option.mode}
                            type="button"
                            onClick={() => setActiveVerseContentMode(option.mode)}
                            aria-pressed={isActive}
                            className={`min-w-[3.5rem] rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] transition-all duration-300 sm:text-[11px] ${
                                isActive
                                    ? 'bg-gold-primary text-white shadow-sm dark:bg-gold-light dark:text-[#2a2116]'
                                    : 'text-gold-primary hover:bg-gold-surface/60 dark:text-gold-light dark:hover:bg-dark-bg/70'
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>
        ) : null;

    return (
        <header
            className={`glass-panel sticky top-0 z-50 w-full border-b border-gold-primary/20 shadow-sm transition-colors duration-500 dark:border-dark-border/60 ${className}`}
        >
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5 lg:hidden">
                <div className="flex min-w-0 flex-1 items-center gap-1 text-text-primary dark:text-dark-text-primary sm:gap-2">
                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-1 truncate sm:gap-2.5">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-6 w-6 sm:h-7 sm:w-7" />
                        </span>
                        <span className="mt-0.5 hidden truncate font-display text-[18px] font-medium tracking-[0.03em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary sm:inline sm:text-[24px] sm:tracking-[0.04em]">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:ml-3 sm:gap-3">
                    {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                    {rightContent}

                    {renderVerseModeToggle()}

                    <ThemeToggle className="ml-0 sm:ml-2" />
                </div>
            </div>

            <div
                className={`hidden h-16 items-center lg:grid ${
                    showSidebarToggle ? 'lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:grid-cols-1'
                }`}
                style={desktopGridStyle}
            >
                <div className="col-start-2 flex min-w-0 items-center justify-between gap-6 px-5">
                    <div className="flex min-w-0 items-center gap-2 text-text-primary dark:text-dark-text-primary">
                        <Link to={targetUrl} className="group flex min-w-0 items-center gap-2.5 truncate">
                            <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                                <BookOpenText className="h-7 w-7" />
                            </span>
                            <span className="mt-0.5 truncate font-display text-[24px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                                {title}
                            </span>
                        </Link>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                        {rightContent}

                        {renderVerseModeToggle()}

                        <ThemeToggle className="ml-0" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
