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
            <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-shell-canvas text-text-primary transition-colors duration-500 selection:bg-gold-primary/25 selection:text-text-primary dark:bg-shell-canvas-dark dark:text-dark-text-primary dark:selection:text-dark-text-primary">
                <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,252,247,0.72)_0%,_rgba(255,248,239,0.24)_32%,_transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.1)_0%,transparent_18%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05)_0%,_rgba(255,255,255,0.015)_32%,_transparent_72%),linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_18%)]" />

                <div className="relative z-10 mx-auto flex h-full w-full max-w-[1680px] flex-col px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-gold-border/14 bg-shell-main shadow-[0_28px_90px_-38px_rgba(0,0,0,0.42)] backdrop-blur-xl transition-colors duration-500 dark:border-dark-border/55 dark:bg-shell-main-dark dark:shadow-[0_28px_90px_-38px_rgba(0,0,0,0.68)]">
                        <div className="shrink-0 border-b border-gold-border/10 bg-shell-header/92 backdrop-blur-xl dark:border-dark-border/55 dark:bg-shell-header-dark/92">{header}</div>
                        <div
                            className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent ${
                                desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:flex-row'
                            } ${desktopGridColumns ? 'lg:gap-0' : ''}`}
                            style={desktopGridStyle}
                        >
                            {sidebar}
                            <main
                                id="main-scroll-container"
                                className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto bg-shell-main dark:bg-shell-main-dark ${
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
