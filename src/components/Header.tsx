import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Edit3, MessageSquare, PanelRightOpen } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
    title?: ReactNode;
    targetUrl?: string;
    showSidebarToggle?: boolean;
    rightContent?: ReactNode;
    className?: string;
}

interface PanelToggleButtonProps {
    icon: ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    title: string;
}

const PanelToggleButton = ({ icon, label, isActive, onClick, title }: PanelToggleButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        aria-pressed={isActive}
        className={`group inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
            isActive
                ? 'border-gold-primary bg-gold-primary text-white shadow-[0_10px_30px_-16px_rgba(166,139,92,0.95)]'
                : 'border-gold-primary/20 bg-white/75 text-[#6F6759] hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-dark-text-secondary dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80'
        }`}
    >
        <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                isActive
                    ? 'border-white/25 bg-white/12 text-white'
                    : 'border-[#D8C8AE] bg-white/85 text-[#76684E] group-hover:border-gold-primary/40 group-hover:text-gold-primary dark:border-dark-border dark:bg-dark-bg/80 dark:text-gold-light'
            }`}
        >
            {icon}
        </span>
        <span className="leading-none">{label}</span>
    </button>
);

const Header = ({
    title = 'Default Title',
    targetUrl = '/',
    showSidebarToggle = false,
    rightContent,
    className = '',
}: HeaderProps) => {
    const { toggleSidebar, toggleRightPanel, activeRightPanel, activeDesktopRightPanel } = useUI();

    const isReflectionsActive = activeRightPanel === 'reflections' || activeDesktopRightPanel === 'reflections';
    const isCommentaryActive = activeRightPanel === 'commentary' || activeDesktopRightPanel === 'commentary';

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b border-gold-primary/20 shadow-sm glass-panel transition-colors duration-500 dark:border-dark-border/60 ${className}`}
        >
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <div className="min-w-0 flex items-center gap-2 text-text-primary dark:text-dark-text-primary sm:gap-4">
                    {showSidebarToggle && (
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="shrink-0 rounded-xl p-1.5 text-gold-primary transition-all duration-300 hover:bg-gold-surface/50 dark:text-gold-light dark:hover:bg-dark-surface/50 sm:p-2"
                            title="챕터 목록 열기"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    )}

                    <Link to={targetUrl} className="group flex min-w-0 items-center gap-2 truncate sm:gap-3">
                        <span className="shrink-0 font-serif text-[28px] leading-none text-gold-primary opacity-90 transition-transform duration-700 group-hover:rotate-90">
                            ॐ
                        </span>
                        <span className="mt-0.5 truncate font-display text-[22px] font-medium tracking-[0.08em] text-text-primary transition-colors group-hover:text-gold-primary dark:text-dark-text-primary sm:text-[25px]">
                            {title}
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    {rightContent}

                    {showSidebarToggle && (
                        <div className="hidden items-center gap-2 sm:flex">
                            <PanelToggleButton
                                icon={<Edit3 className="h-3.5 w-3.5" />}
                                label="Reflections"
                                isActive={isReflectionsActive}
                                onClick={() => toggleRightPanel('reflections')}
                                title="통찰 기록 열기"
                            />
                            <PanelToggleButton
                                icon={<MessageSquare className="h-3.5 w-3.5" />}
                                label="Commentary"
                                isActive={isCommentaryActive}
                                onClick={() => toggleRightPanel('commentary')}
                                title="코멘터리 열기"
                            />
                        </div>
                    )}

                    {showSidebarToggle && (
                        <button
                            type="button"
                            onClick={() => toggleRightPanel(isCommentaryActive ? 'commentary' : 'reflections')}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-primary/20 bg-white/75 text-gold-primary transition-all duration-300 hover:border-gold-primary/35 hover:bg-gold-surface/80 dark:border-dark-border/70 dark:bg-dark-surface/80 dark:text-gold-light dark:hover:border-gold-primary/30 dark:hover:bg-dark-bg/80 sm:hidden"
                            title="오른쪽 패널 토글"
                        >
                            {isCommentaryActive ? <MessageSquare className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                        </button>
                    )}

                    <ThemeToggle className="ml-1 sm:ml-2" />
                </div>
            </div>
        </header>
    );
};

export default Header;
