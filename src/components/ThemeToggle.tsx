import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
    const { theme, toggleTheme } = useTheme();
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold-border/12 bg-shell-main/82 text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-surface/70 hover:shadow-[0_10px_24px_-18px_rgba(0,0,0,0.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-header dark:border-dark-border/70 dark:bg-shell-main-dark/82 dark:hover:bg-white/6 dark:focus-visible:ring-offset-shell-header-dark ${className}`}
            aria-label={label}
            title={label}
        >
            {theme === 'dark' ? <Sun className="h-4 w-4 opacity-85 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 opacity-85 sm:h-5 sm:w-5" />}
        </button>
    );
};

export default ThemeToggle;
