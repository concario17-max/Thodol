import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

export interface SidebarLayoutProps {
    isOpen: boolean;
    isDesktopOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    position?: 'left' | 'right';
    widthClass?: string;
    desktopWidthClass?: string;
    desktopMinWidthClass?: string;
}

const closeButtonClass =
    'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold-border/12 bg-shell-main/88 text-text-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-shell-header/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-shell-rail dark:border-dark-border/70 dark:bg-shell-main-dark/86 dark:text-dark-text-secondary dark:hover:bg-white/6 dark:focus-visible:ring-offset-shell-rail-dark';

export const SidebarLayout = React.memo(
    ({
        isOpen,
        isDesktopOpen,
        onClose,
        title,
        children,
        position = 'left',
        widthClass = 'w-80',
        desktopWidthClass = 'lg:w-[19rem]',
        desktopMinWidthClass = 'lg:min-w-[19rem]',
    }: SidebarLayoutProps) => {
        const isLeft = position === 'left';
        const placementClass = isLeft ? 'lg:left-0' : 'lg:right-0';
        const surfaceClass = isLeft ? 'bg-shell-rail dark:bg-shell-rail-dark' : 'bg-shell-commentary dark:bg-shell-commentary-dark';
        const borderClass = isLeft ? 'border-gold-border/12 dark:border-dark-border/70' : 'border-gold-border/10 dark:border-dark-border/70';
        const desktopBorderClass = isLeft
            ? 'lg:border-r lg:border-gold-border/10 dark:lg:border-dark-border/70'
            : 'lg:border-l lg:border-gold-border/10 dark:lg:border-dark-border/70';
        const mobileStateClass = isOpen ? `flex ${widthClass} overflow-hidden border ${borderClass} ${surfaceClass}` : 'hidden';
        const desktopStateClass = isDesktopOpen
            ? `${desktopWidthClass} ${desktopMinWidthClass} lg:flex lg:translate-x-0 lg:opacity-100 ${desktopBorderClass} ${surfaceClass}`
            : 'overflow-hidden p-0 px-0 lg:flex lg:w-0 lg:min-w-0 lg:translate-x-0 lg:opacity-0 lg:border-0';

        return (
            <>
                <aside
                    className={`relative z-50 h-auto flex-col overscroll-contain bg-transparent font-pretendard transition-all duration-300 lg:sticky lg:top-0 lg:h-[100dvh] ${placementClass}
                    ${mobileStateClass}
                    ${desktopStateClass}`}
                >
                    {title ? (
                        <div className="flex shrink-0 items-center gap-3 border-b border-gold-border/10 px-3 py-3 dark:border-dark-border/70 lg:hidden">
                            <span className="inline-flex items-center rounded-full border border-gold-border/12 bg-shell-main/80 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.34em] text-gold-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] dark:border-dark-border/70 dark:bg-shell-main-dark/80 dark:text-gold-light">
                                {title}
                            </span>
                            <span className="h-px flex-1 bg-gold-border/30 dark:bg-dark-border/45" />
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close sidebar"
                                className={closeButtonClass}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="absolute right-4 top-4 z-50 lg:hidden">
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close sidebar"
                                className={closeButtonClass}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-1 flex-col overflow-hidden pb-safe-offset-4">{children}</div>
                </aside>
            </>
        );
    },
);
