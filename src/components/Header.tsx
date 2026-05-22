import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, ScrollText } from 'lucide-react';
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

const railPillClass =
    'app-surface-panel inline-flex items-center rounded-full p-0.5';

const modeButtonBaseClass =
    'app-interactive inline-flex min-w-[3.5rem] items-center justify-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-main dark:focus-visible:ring-offset-shell-main-dark sm:min-w-[3.75rem] sm:text-[10.5px]';

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
            <div className={railPillClass}>
                {[
                    { mode: 'commentary' as const, label: 'Commentary', icon: ScrollText, ariaLabel: 'Switch to commentary view' },
                    { mode: 'body' as const, label: 'Text', icon: BookOpenText, ariaLabel: 'Switch to text view' },
                ].map((option) => {
                    const isActive = activeVerseContentMode === option.mode;
                    const Icon = option.icon;

                    return (
                        <button
                            key={option.mode}
                            type="button"
                            onClick={() => setActiveVerseContentMode(option.mode)}
                            aria-pressed={isActive}
                            aria-label={option.ariaLabel}
                            className={`${modeButtonBaseClass} ${
                                isActive
                                    ? 'bg-gold-primary text-white shadow-[0_10px_24px_-12px_rgba(143,100,19,0.6)] dark:bg-gold-light dark:text-[#2a2116]'
                                    : 'text-gold-primary hover:bg-gold-surface/70 dark:text-gold-light dark:hover:bg-white/6'
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            {option.label}
                        </button>
                    );
                })}
            </div>
        ) : null;

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-border/12 bg-shell-header shadow-none transition-colors duration-500 backdrop-blur-0 dark:border-dark-border/60 dark:bg-shell-header-dark ${className}`}>
            <div className="container mx-auto max-w-7xl px-4 py-2 sm:px-5 lg:hidden">
                <div className="flex min-w-0 items-center gap-2 text-text-primary dark:text-dark-text-primary">
                    <Link
                        to={targetUrl}
                        className="group flex min-w-0 items-center gap-2 truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-header dark:focus-visible:ring-offset-shell-header-dark"
                    >
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-500 group-hover:rotate-3" aria-hidden="true">
                            <BookOpenText className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 truncate font-display text-[16px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="mt-2 flex w-full flex-col gap-2 border-t border-gold-border/10 pt-2 dark:border-dark-border/50">
                    <div className="flex flex-wrap items-center gap-2">
                        {rightContent}
                        {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                        <div className="ml-auto flex items-center gap-2">{renderVerseModeToggle()}</div>
                    </div>
                </div>
            </div>

            <div
                className={`hidden h-12 w-full items-center lg:grid ${
                    showSidebarToggle ? 'lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:grid-cols-1'
                }`}
                style={desktopGridStyle}
            >
                <div className="flex min-w-0 items-center gap-3 px-5">
                    <Link
                        to={targetUrl}
                        className="group flex min-w-0 items-center gap-2 truncate text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-header dark:focus-visible:ring-offset-shell-header-dark dark:text-dark-text-primary"
                    >
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-500 group-hover:rotate-3" aria-hidden="true">
                            <BookOpenText className="h-6 w-6" />
                        </span>
                        <span className="truncate font-display text-[20px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="flex min-w-0 items-center justify-end gap-3 px-5">
                    <div className={railPillClass}>
                        {rightContent}
                        {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                        {renderVerseModeToggle()}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
