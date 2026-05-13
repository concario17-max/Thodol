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
        void isMobilePanelOpen;

        return (
            <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#f1eadf] text-text-primary transition-colors duration-500 selection:bg-gold-primary/25 selection:text-text-primary dark:bg-[#11100e] dark:text-dark-text-primary dark:selection:text-dark-text-primary">
                <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,249,240,0.58)_0%,_rgba(255,249,240,0.2)_32%,_transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.18)_0%,transparent_16%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0.015)_32%,_transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_16%)]" />

                <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden lg:px-4 lg:py-4">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f6efe4]/82 dark:bg-[#141210]/88 lg:rounded-[28px] lg:bg-[#f6efe4]/74 dark:lg:bg-[#13110f]/84">
                        {header}
                        <div
                            className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent ${
                                desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:flex-row'
                            } ${desktopGridColumns ? 'lg:gap-4' : ''}`}
                            style={desktopGridStyle}
                        >
                            {sidebar}
                            <main
                                id="main-scroll-container"
                                className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#f8f4eb]/90 backdrop-blur-[1px] dark:bg-[#14110f]/88 ${
                                    desktopGridColumns ? 'lg:col-start-2 lg:w-full' : ''
                                }`}
                            >
                                {children}
                            </main>
                            {rightPanel}
                        </div>
                    </div>

                    {floatingAction && <div className="fixed bottom-6 right-6 z-50 sm:bottom-8 sm:right-8">{floatingAction}</div>}
                </div>
            </div>
        );
    },
);
