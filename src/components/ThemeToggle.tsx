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
            className={`app-icon-button transition-shadow hover:shadow-[0_14px_28px_-20px_rgba(0,0,0,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-header dark:focus-visible:ring-offset-shell-header-dark ${className}`}
            aria-label={label}
            title={label}
        >
            {theme === 'dark' ? <Sun className="h-4 w-4 opacity-85 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 opacity-85 sm:h-5 sm:w-5" />}
        </button>
    );
};

export default ThemeToggle;
