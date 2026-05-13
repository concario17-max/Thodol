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
            <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-[#f3ede4] text-text-primary transition-colors duration-500 selection:bg-gold-primary/25 selection:text-text-primary dark:bg-[#11100e] dark:text-dark-text-primary dark:selection:text-dark-text-primary">
                <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(255,252,247,0.72)_0%,_rgba(255,248,239,0.24)_34%,_transparent_74%),linear-gradient(180deg,rgba(255,255,255,0.16)_0%,transparent_18%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.045)_0%,_rgba(255,255,255,0.012)_34%,_transparent_74%),linear-gradient(180deg,rgba(255,255,255,0.025)_0%,transparent_18%)]" />

                <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#faf6ef] dark:bg-[#13110f]">
                        {header}
                        <div
                            className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent ${
                                desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:flex-row'
                            } ${desktopGridColumns ? 'lg:gap-0' : ''}`}
                            style={desktopGridStyle}
                        >
                            {sidebar}
                            <main
                                id="main-scroll-container"
                                className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto bg-[#fbf8f1] backdrop-blur-0 dark:bg-[#13110f] ${
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
