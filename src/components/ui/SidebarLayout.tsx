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
        const mobileTranslateClosed = isLeft ? '-translate-x-full' : 'translate-x-full';
        const borderClass = isLeft ? 'border-r' : 'border-l';
        const placementClass = isLeft ? 'left-0' : 'right-0';
        const mobileStateClass = isOpen
            ? `${widthClass} translate-x-0 overflow-hidden shadow-2xl lg:shadow-none`
            : `w-[90vw] ${mobileTranslateClosed}`;
        const desktopStateClass = isDesktopOpen
            ? `${desktopWidthClass} ${desktopMinWidthClass} lg:translate-x-0 lg:opacity-100`
            : 'overflow-hidden p-0 px-0 lg:w-0 lg:min-w-0 lg:border-none lg:translate-x-0 lg:opacity-0';

        return (
            <>
                {isOpen && (
                    <div
                        className="fixed inset-x-0 bottom-0 top-16 z-40 touch-none bg-black/50 opacity-100 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
                        onClick={onClose}
                    />
                )}

                <aside
                    className={`fixed bottom-0 top-16 ${placementClass} z-50 flex h-[calc(100dvh-64px)] flex-col overscroll-contain border-gold-primary/20 bg-white/40 font-pretendard backdrop-blur-md transition-all duration-300 dark:border-dark-border/50 dark:bg-dark-surface/40 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] ${borderClass}
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
