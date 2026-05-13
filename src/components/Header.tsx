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
            <div className="inline-flex items-center rounded-full border border-gold-border/20 bg-white/78 p-1 shadow-[0_12px_28px_-22px_rgba(96,72,21,0.28)] backdrop-blur-md dark:border-dark-border/70 dark:bg-[#1b1815]/82">
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
        <header
            className={`glass-panel sticky top-0 z-50 w-full border-b border-gold-border/18 bg-white/62 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.28)] transition-colors duration-500 backdrop-blur-xl dark:border-dark-border/60 dark:bg-dark-surface/84 ${className}`}
        >
            <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-5 lg:hidden">
                <div className="flex min-w-0 items-center gap-3 text-text-primary dark:text-dark-text-primary">
                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-2 truncate">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-6 w-6" />
                        </span>
                        <span className="min-w-0 truncate font-display text-[18px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary sm:text-[22px]">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="mt-3 flex w-full flex-col gap-2 rounded-[1.2rem] border border-gold-border/16 bg-white/72 p-2 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.22)] backdrop-blur-md dark:border-dark-border/60 dark:bg-[#1b1815]/82">
                    {selectionControls ? <div className="min-w-0">{selectionControls}</div> : null}

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            {rightContent}
                        </div>

                        <div className="flex items-center gap-2">
                            {renderVerseModeToggle()}
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`hidden h-16 w-full items-center lg:grid ${
                    showSidebarToggle ? 'lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:grid-cols-1'
                }`}
                style={desktopGridStyle}
            >
                <div className="flex min-w-0 items-center px-5">
                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-2.5 truncate text-text-primary dark:text-dark-text-primary">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-7 w-7" />
                        </span>
                        <span className="mt-0.5 truncate font-display text-[24px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="flex min-w-0 items-center justify-end gap-3 px-5">
                    <div className="flex items-center gap-2 rounded-full border border-gold-border/16 bg-white/72 p-1 shadow-[0_10px_24px_-18px_rgba(0,0,0,0.22)] backdrop-blur-md dark:border-dark-border/60 dark:bg-[#1b1815]/82">
                        {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                        {rightContent}
                        {renderVerseModeToggle()}
                    </div>

                    <ThemeToggle className="ml-0" />
                </div>
            </div>
        </header>
    );
};

export default Header;
