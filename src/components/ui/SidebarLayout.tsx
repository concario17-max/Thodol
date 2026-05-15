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
        desktopWidthClass = 'lg:w-[19rem]',
        desktopMinWidthClass = 'lg:min-w-[19rem]',
        }: SidebarLayoutProps) => {
        const isLeft = position === 'left';
        const placementClass = isLeft ? 'lg:left-0' : 'lg:right-0';
        const surfaceClass = isLeft
            ? 'bg-shell-rail [background-image:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.015)_18%,rgba(88,84,77,0.05)_100%)] dark:bg-shell-rail-dark dark:[background-image:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01)_20%,rgba(0,0,0,0.08)_100%)]'
            : 'bg-shell-commentary dark:bg-shell-commentary-dark';
        const mobileBorderClass = isLeft ? 'border-zinc-300/45 dark:border-white/8' : 'border-gold-border/10 dark:border-white/6';
        const desktopBorderClass = isLeft ? 'lg:border-r lg:border-zinc-300/40 dark:lg:border-white/8' : 'lg:border-l';
        const mobileStateClass = isOpen ? `flex ${widthClass} overflow-hidden border ${mobileBorderClass} ${surfaceClass}` : 'hidden';
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
                        <div className="flex shrink-0 items-center justify-between border-b border-gold-border/10 px-4 pb-3 pt-4 dark:border-white/6 lg:hidden">
                            <span className="w-full font-crimson text-lg font-bold text-text-primary dark:text-dark-text-primary">{title}</span>
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute right-4 top-3 rounded-full p-2 text-text-secondary transition-colors hover:bg-shell-header/80 dark:text-dark-text-secondary dark:hover:bg-white/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="absolute right-4 top-4 z-50 lg:hidden">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-full p-2 text-text-secondary transition-colors hover:bg-shell-header/80 dark:text-dark-text-secondary dark:hover:bg-white/5"
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
