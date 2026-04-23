import { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Menu, MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ThemeToggle from './ThemeToggle';
import { DESKTOP_VERSE_COLUMNS_DEFAULT } from './ui/desktopVerseLayout';

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
    const { toggleSidebar, toggleRightPanel, activeRightPanel, activeDesktopRightPanel } = useUI();

    const activePanel = activeRightPanel || activeDesktopRightPanel;
    const isCommentaryOpen = activePanel === 'commentary';
    const desktopGridStyle = showSidebarToggle
        ? ({ '--desktop-verse-columns': DESKTOP_VERSE_COLUMNS_DEFAULT } as CSSProperties)
        : undefined;

    return (
        <header
            className={`glass-panel sticky top-0 z-50 w-full border-b border-gold-primary/20 shadow-sm transition-colors duration-500 dark:border-dark-border/60 ${className}`}
        >
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5 lg:hidden">
                <div className="flex min-w-0 flex-1 items-center gap-1 text-text-primary dark:text-dark-text-primary sm:gap-2">
                    {showSidebarToggle && (
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="-ml-1 shrink-0 rounded-xl p-2 text-gold-primary transition-all duration-300 hover:bg-gold-surface/50 dark:text-gold-light dark:hover:bg-dark-surface/50"
                            title="Open chapter sidebar"
                            aria-label="Open chapter sidebar"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}

                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-1 truncate sm:gap-2.5">
                        <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                            <BookOpenText className="h-6 w-6 sm:h-7 sm:w-7" />
                        </span>
                        <span className="mt-0.5 hidden truncate font-display text-[18px] font-medium tracking-[0.03em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary sm:inline sm:text-[24px] sm:tracking-[0.04em]">
                            {title}
                        </span>
                    </Link>

                    {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:ml-3 sm:gap-3">
                    {rightContent}

                    {showSidebarToggle && (
                        <button
                            type="button"
                            onClick={() => toggleRightPanel('commentary')}
                            className="group inline-flex h-10 items-center gap-2 rounded-full border border-gold-primary/18 bg-white/78 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-primary shadow-[0_10px_24px_-20px_rgba(166,139,92,0.9)] backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-gold-light dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80 sm:h-11 sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
                            title={isCommentaryOpen ? 'Close commentary panel' : 'Open commentary panel'}
                            aria-label={isCommentaryOpen ? 'Close commentary panel' : 'Open commentary panel'}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-primary/20 bg-white/85 text-[#8A7756] transition-colors group-hover:border-gold-primary/35 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/70 dark:text-gold-light">
                                <MessageSquare className="h-3.5 w-3.5" />
                            </span>
                            <span className="hidden min-[420px]:inline">Commentary</span>
                        </button>
                    )}

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
                        {showSidebarToggle && (
                            <button
                                type="button"
                                onClick={toggleSidebar}
                                className="shrink-0 rounded-xl p-2 text-gold-primary transition-all duration-300 hover:bg-gold-surface/50 dark:text-gold-light dark:hover:bg-dark-surface/50"
                                title="Open chapter sidebar"
                                aria-label="Open chapter sidebar"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                        )}

                        <Link to={targetUrl} className="group flex min-w-0 items-center gap-2.5 truncate">
                            <span className="flex shrink-0 items-center justify-center text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-6">
                                <BookOpenText className="h-7 w-7" />
                            </span>
                            <span className="mt-0.5 truncate font-display text-[24px] font-medium tracking-[0.04em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary">
                                {title}
                            </span>
                        </Link>

                        {selectionControls ? <div className="min-w-0 shrink-0">{selectionControls}</div> : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                        {rightContent}

                        {showSidebarToggle && (
                            <button
                                type="button"
                                onClick={() => toggleRightPanel('commentary')}
                                className="group inline-flex h-11 items-center gap-2 rounded-full border border-gold-primary/18 bg-white/78 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-primary shadow-[0_10px_24px_-20px_rgba(166,139,92,0.9)] backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-gold-light dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80"
                                title={isCommentaryOpen ? 'Close commentary panel' : 'Open commentary panel'}
                                aria-label={isCommentaryOpen ? 'Close commentary panel' : 'Open commentary panel'}
                            >
                                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-primary/20 bg-white/85 text-[#8A7756] transition-colors group-hover:border-gold-primary/35 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/70 dark:text-gold-light">
                                    <MessageSquare className="h-3.5 w-3.5" />
                                </span>
                                <span>Commentary</span>
                            </button>
                        )}

                        <ThemeToggle className="ml-0" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
