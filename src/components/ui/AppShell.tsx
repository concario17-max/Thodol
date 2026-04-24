import React, { ReactNode } from 'react';

export interface AppShellProps {
    header?: ReactNode;
    sidebar?: ReactNode;
    rightPanel?: ReactNode;
    floatingAction?: ReactNode;
    children: ReactNode;
    isMobilePanelOpen?: boolean;
    desktopGridColumns?: string;
}

export const AppShell = React.memo(
    ({ header, sidebar, rightPanel, floatingAction, children, isMobilePanelOpen = false, desktopGridColumns }: AppShellProps) => {
        const desktopGridStyle = desktopGridColumns
            ? ({ '--desktop-verse-columns': desktopGridColumns } as React.CSSProperties)
            : undefined;

        return (
            <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#f3ead9] text-text-primary transition-colors duration-500 selection:bg-gold-primary/25 selection:text-text-primary dark:bg-[#151311] dark:text-dark-text-primary dark:selection:text-dark-text-primary">
                <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,248,236,0.42)_0%,_rgba(255,248,236,0.16)_34%,_transparent_78%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0.015)_34%,_transparent_78%)]" />

                <div className="relative z-10 flex h-full flex-1 flex-col overflow-hidden">
                    {header}
                    <div
                        className={`relative flex flex-1 overflow-hidden ${
                            desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : ''
                        }`}
                        style={desktopGridStyle}
                    >
                        {sidebar}
                        <main
                            id="main-scroll-container"
                            className={`custom-scrollbar min-w-0 flex-1 bg-white/18 backdrop-blur-[2px] dark:bg-white/22 ${
                                isMobilePanelOpen ? 'touch-none overflow-hidden' : 'overflow-y-auto'
                            } ${desktopGridColumns ? 'lg:col-start-2 lg:w-full' : ''}`}
                        >
                            {children}
                        </main>
                        {rightPanel}
                    </div>

                    {floatingAction && <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">{floatingAction}</div>}
                </div>
            </div>
        );
    },
);
