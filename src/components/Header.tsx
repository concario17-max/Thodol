import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Edit3, MessageSquare } from 'lucide-react';
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
    title = "Default Title",
    targetUrl = "/",
    showSidebarToggle = false,
    rightContent,
    className = ""
}: HeaderProps) => {
    const { toggleSidebar, toggleRightPanel, activeDesktopRightPanel } = useUI();

    return (
        <header className={`sticky top-0 z-50 w-full border-b border-gold-primary/20 dark:border-dark-border/60 bg-white/60 dark:bg-[#070707]/60 backdrop-blur-xl transition-colors duration-500 shadow-sm ${className}`}>
            <div className={`container mx-auto flex h-16 items-center px-4 justify-between max-w-7xl`}>

                {/* Left Side: Logo / Title */}
                <div className="flex items-center gap-2 sm:gap-4 tracking-widest text-text-primary dark:text-dark-text-primary min-w-0">
                    {showSidebarToggle && (
                        <button
                            onClick={toggleSidebar}
                            className="p-1.5 sm:p-2 -ml-2 rounded-lg hover:bg-gold-surface dark:hover:bg-dark-surface text-gold-primary dark:text-gold-light transition-colors shrink-0"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    )}
                    <Link to={targetUrl} className="flex items-center gap-2 sm:gap-2.5 group truncate min-w-0">
                        <span className="text-xl font-serif text-gold-primary leading-none opacity-80 group-hover:scale-110 transition-transform shrink-0">֍</span>
                        <span className="font-bold text-base sm:text-lg transition-colors font-crimson uppercase truncate mt-0.5">
                            {title}
                        </span>
                    </Link>
                </div>

                {/* Right Side: Dynamic Content & Theme Toggle */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {rightContent}
                    
                    {showSidebarToggle && (
                        <div className="flex items-center gap-1 bg-gold-bg dark:bg-dark-surface p-1 rounded-full border border-gold-primary/10">
                            <button
                                onClick={() => toggleRightPanel('reflections')}
                                className={`p-1.5 rounded-full transition-colors ${activeDesktopRightPanel === 'reflections' ? 'bg-gold-primary text-white' : 'text-gold-primary dark:text-gold-light hover:bg-gold-surface dark:hover:bg-dark-bg'}`}
                                title="통찰 기록 열기"
                            >
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => toggleRightPanel('commentary')}
                                className={`p-1.5 rounded-full transition-colors ${activeDesktopRightPanel === 'commentary' ? 'bg-gold-primary text-white' : 'text-gold-primary dark:text-gold-light hover:bg-gold-surface dark:hover:bg-dark-bg'}`}
                                title="코멘터리 열기"
                            >
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    
                    <ThemeToggle className="ml-1 sm:ml-2" />
                </div>
            </div>
        </header>
    );
};

export default Header;
