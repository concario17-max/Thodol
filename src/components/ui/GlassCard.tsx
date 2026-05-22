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
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 dark:from-white/[0.03] dark:to-transparent" />

                {icon && (
                    <div className="relative z-10 mb-4 flex h-6 w-6 items-center justify-center text-brand/60 transition-transform group-hover:scale-110">
                        {icon}
                    </div>
                )}

                <div className="relative z-10 mb-auto flex w-full flex-col items-center">
                    {subtitle && (
                        <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-brand/90 drop-shadow-sm dark:text-brand-soft/90">
                            {subtitle}
                        </span>
                    )}

                    <h2 className="mb-4 flex flex-col gap-2 px-2 font-bold tracking-wide text-text-primary font-noto-kr dark:text-dark-text-primary">
                        {title}
                    </h2>

                    <div className="mx-auto my-4 h-px w-12 bg-border/80 transition-all duration-500 group-hover:w-20" />

                    {description && (
                        <p className="mx-auto max-w-[260px] px-1 text-[13px] font-medium leading-[1.7] text-text-secondary opacity-80 dark:text-dark-text-secondary">
                            {description}
                        </p>
                    )}
                </div>
            </>
        );

        const baseStyle = `group relative flex min-h-[380px] flex-col items-center justify-start overflow-hidden rounded-[var(--app-radius-card)] border border-[color:var(--card-border)] bg-[var(--card-bg)] p-5 pt-10 text-center shadow-[var(--card-shadow)] backdrop-blur-xl transition-all duration-700 ease-[0.2,0,0,1] hover:border-[color:var(--app-color-brand-soft)] hover:shadow-[var(--card-shadow-hover)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:min-h-[440px] sm:p-6 sm:pt-14 lg:min-h-[300px] lg:p-4 lg:pt-7 [--card-bg:var(--app-color-surface-glass)] [--card-border:var(--app-color-surface-glass-border)] [--card-shadow:var(--app-shadow-card)] [--card-shadow-hover:var(--app-shadow-card-hover)] dark:[--card-bg:var(--app-color-surface-glass)] dark:[--card-border:var(--app-color-surface-glass-border)] dark:[--card-shadow:var(--app-shadow-card-dark)] dark:[--card-shadow-hover:var(--app-shadow-card-hover-dark)] ${className}`;

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
