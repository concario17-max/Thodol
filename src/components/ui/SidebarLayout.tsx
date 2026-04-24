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

export const SidebarLayout = React.memo(
    ({
        isOpen,
        isDesktopOpen,
        onClose,
        title,
        children,
        position = 'left',
        widthClass = 'w-80',
        desktopWidthClass = 'lg:w-80',
        desktopMinWidthClass = '',
    }: SidebarLayoutProps) => {
        const isLeft = position === 'left';
        const borderClass = isLeft ? 'border-b lg:border-r' : 'border-b lg:border-l';
        const placementClass = isLeft ? 'lg:left-0' : 'lg:right-0';
        const mobileStateClass = isOpen ? `flex ${widthClass} overflow-hidden shadow-2xl lg:shadow-none` : 'hidden';
        const desktopStateClass = isDesktopOpen
            ? `${desktopWidthClass} ${desktopMinWidthClass} lg:flex lg:translate-x-0 lg:opacity-100`
            : 'overflow-hidden p-0 px-0 lg:flex lg:w-0 lg:min-w-0 lg:border-none lg:translate-x-0 lg:opacity-0';

        return (
            <>
                <aside
                    className={`relative z-50 h-auto flex-col overscroll-contain border-gold-primary/20 bg-white/40 font-pretendard backdrop-blur-md transition-all duration-300 dark:border-dark-border/50 dark:bg-dark-surface/40 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] ${borderClass} ${placementClass}
                    ${mobileStateClass}
                    ${desktopStateClass}`}
                >
                    {title ? (
                        <div className="flex shrink-0 items-center justify-between border-b border-gold-border/30 p-4 dark:border-[#333] lg:hidden">
                            <span className="w-full font-crimson text-lg font-bold text-text-primary dark:text-dark-text-primary">{title}</span>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-4 -mr-2 rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="absolute right-4 top-4 z-50 lg:hidden">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full p-2 text-text-secondary transition-colors hover:bg-gold-surface dark:text-dark-text-secondary dark:hover:bg-dark-surface"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-1 flex-col overflow-hidden pb-safe-offset-4">{children}</div>
                </aside>
            </>
        );
    },
);
