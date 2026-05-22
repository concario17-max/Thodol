import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface GlassCardProps {
    href?: string;
    onClick?: () => void;
    icon?: ReactNode;
    subtitle?: string;
    title: ReactNode;
    description?: string;
    className?: string;
}

export const GlassCard = React.memo(
    ({ href, onClick, icon, subtitle, title, description, className = '' }: GlassCardProps) => {
        const content = (
            <>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5)_0%,_transparent_56%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05)_0%,_transparent_56%)]" />

                {icon && (
                    <div className="relative z-10 mb-4 flex h-6 w-6 items-center justify-center text-brand/70 transition-transform duration-300 group-hover:scale-105">
                        {icon}
                    </div>
                )}

                <div className="relative z-10 mb-auto flex w-full flex-col items-center">
                    {subtitle && (
                        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.34em] text-brand/90 drop-shadow-sm dark:text-brand-soft/90">
                            {subtitle}
                        </span>
                    )}

                    <h2 className="mb-4 flex flex-col gap-2 px-2 font-bold tracking-wide text-text-primary font-noto-kr dark:text-dark-text-primary">
                        {title}
                    </h2>

                    <div className="mx-auto my-4 h-px w-12 bg-border/80 transition-all duration-500 group-hover:w-16" />

                    {description && (
                        <p className="mx-auto max-w-[260px] px-1 text-[13px] font-medium leading-[1.7] text-text-secondary opacity-80 dark:text-dark-text-secondary">
                            {description}
                        </p>
                    )}
                </div>
            </>
        );

        const baseStyle = `group app-panel-card app-interactive relative flex min-h-[380px] flex-col items-center justify-start overflow-hidden rounded-[var(--app-radius-card)] p-5 pt-10 text-center active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:min-h-[440px] sm:p-6 sm:pt-14 lg:min-h-[300px] lg:p-4 lg:pt-7 ${className}`;

        if (href) {
            return (
                <Link to={href} className={baseStyle} onClick={onClick}>
                    {content}
                </Link>
            );
        }

        return (
            <button type="button" className={baseStyle} onClick={onClick}>
                {content}
            </button>
        );
    },
);
