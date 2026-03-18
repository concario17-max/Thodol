import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Edit3, Menu, MessageSquare } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    title?: ReactNode;
    targetUrl?: string;
    showSidebarToggle?: boolean;
    rightContent?: ReactNode;
    className?: string;
}

const Header = ({
    title = 'Yoga Sutras',
    targetUrl = '/',
    showSidebarToggle = false,
    rightContent,
    className = '',
}: HeaderProps) => {
    const { toggleSidebar, toggleRightPanel, activeRightPanel, activeDesktopRightPanel } = useUI();

    const activePanel = activeRightPanel || activeDesktopRightPanel;
    const currentPanel = activePanel === 'commentary' ? 'commentary' : 'reflections';
    const nextPanel = currentPanel === 'commentary' ? 'reflections' : 'commentary';
    const panelMeta =
        currentPanel === 'commentary'
            ? {
                  label: 'Commentary',
                  title: 'Switch to commentary panel',
                  icon: <MessageSquare className="h-3.5 w-3.5" />,
              }
            : {
                  label: 'Reflections',
                  title: 'Switch to reflections panel',
                  icon: <Edit3 className="h-3.5 w-3.5" />,
              };

    return (
        <header
            className={`glass-panel sticky top-0 z-50 w-full border-b border-gold-primary/20 shadow-sm transition-colors duration-500 dark:border-dark-border/60 ${className}`}
        >
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-5">
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
                        <span className="mt-0.5 truncate font-display text-[18px] font-medium tracking-[0.03em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary sm:text-[24px] sm:tracking-[0.04em]">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="ml-2 flex shrink-0 items-center gap-1.5 sm:ml-3 sm:gap-3">
                    {rightContent}

                    {showSidebarToggle && (
                        <button
                            type="button"
                            onClick={() => toggleRightPanel(nextPanel)}
                            className="group inline-flex h-10 items-center gap-2 rounded-full border border-gold-primary/18 bg-white/78 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-primary shadow-[0_10px_24px_-20px_rgba(166,139,92,0.9)] backdrop-blur-sm transition-all duration-300 hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-gold-light dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80 sm:h-11 sm:px-4 sm:text-[11px] sm:tracking-[0.18em]"
                            title={panelMeta.title}
                            aria-label={panelMeta.title}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-primary/20 bg-white/85 text-[#8A7756] transition-colors group-hover:border-gold-primary/35 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/70 dark:text-gold-light">
                                {panelMeta.icon}
                            </span>
                            <span className="hidden min-[420px]:inline">{panelMeta.label}</span>
                        </button>
                    )}

                    <ThemeToggle className="ml-0 sm:ml-2" />
                </div>
            </div>
        </header>
    );
};

export default Header;
