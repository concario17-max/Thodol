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
            <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-canvas text-text-primary transition-colors duration-500 selection:bg-brand/25 selection:text-text-primary">
                <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--app-color-surface)_72%,transparent)_0%,_color-mix(in_srgb,var(--app-color-surface)_18%,transparent)_38%,_transparent_76%),linear-gradient(180deg,color-mix(in_srgb,var(--app-color-surface)_14%,transparent)_0%,transparent_20%)]" />

                <div className="relative z-10 flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-surface/96 backdrop-blur-[2px]">
                        <div className="shrink-0 bg-surface-elevated/94">{header}</div>
                        <div
                            className={`relative flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent ${
                                desktopGridColumns ? 'lg:grid lg:[grid-template-columns:var(--desktop-verse-columns)]' : 'lg:flex-row'
                            } ${desktopGridColumns ? 'lg:gap-0' : ''}`}
                            style={desktopGridStyle}
                        >
                            {sidebar}
                            <main
                                id="main-scroll-container"
                                aria-label="Main content"
                                tabIndex={-1}
                                className={`custom-scrollbar min-h-0 min-w-0 flex-1 overflow-y-auto bg-surface backdrop-blur-0 ${
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
