import { createContext, useContext, useEffect, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';

export type RightPanelType = 'commentary' | null;
export type VerseContentMode = 'body' | 'commentary' | 'album';



interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    activeVerseContentMode: VerseContentMode;
    setActiveVerseContentMode: Dispatch<SetStateAction<VerseContentMode>>;
    lastVersePath: string | null;
    lastNonAlbumVerseContentMode: Exclude<VerseContentMode, 'album'>;
    activeRightPanel: RightPanelType;
    setActiveRightPanel: Dispatch<SetStateAction<RightPanelType>>;
    activeDesktopRightPanel: RightPanelType;
    setActiveDesktopRightPanel: Dispatch<SetStateAction<RightPanelType>>;
    toggleRightPanel: (panel: 'commentary') => void;
    closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeVerseContentMode, setActiveVerseContentMode] = useState<VerseContentMode>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('yoga-verse-content-mode');
            if (saved === 'body' || saved === 'commentary' || saved === 'album') {
                return saved;
            }
        }
        return 'body';
    });
    const [lastVersePath, setLastVersePath] = useState<string | null>(null);
    const [lastNonAlbumVerseContentMode, setLastNonAlbumVerseContentMode] = useState<Exclude<VerseContentMode, 'album'>>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('yoga-verse-content-mode');
            if (saved === 'body' || saved === 'commentary') {
                return saved;
            }
        }
        return 'body';
    });
    const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>(null);

    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) {
                return true;
            }
            const saved = localStorage.getItem('yoga-desktop-sidebar');
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    const [activeDesktopRightPanel, setActiveDesktopRightPanel] = useState<RightPanelType>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('yoga-desktop-right-panel');
            if (saved === 'true') return 'commentary';
            if (saved === 'false') return null;
            return saved !== null ? (JSON.parse(saved) as RightPanelType) : null;
        }
        return null;
    });



    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const updateFromLocation = () => {
            const { pathname } = window.location;
            if (pathname.includes('/chapter/') && pathname.includes('/verse/')) {
                setLastVersePath(pathname);
            }
        };

        const originalPushState = window.history.pushState;
        const originalReplaceState = window.history.replaceState;

        const handleLocationChange = () => updateFromLocation();
        const notifyLocationChange = () => window.dispatchEvent(new Event('codex:locationchange'));

        window.history.pushState = function pushState(...args) {
            const result = originalPushState.apply(this, args as Parameters<History['pushState']>);
            notifyLocationChange();
            return result;
        };

        window.history.replaceState = function replaceState(...args) {
            const result = originalReplaceState.apply(this, args as Parameters<History['replaceState']>);
            notifyLocationChange();
            return result;
        };

        window.addEventListener('popstate', handleLocationChange);
        window.addEventListener('codex:locationchange', handleLocationChange);
        updateFromLocation();

        return () => {
            window.history.pushState = originalPushState;
            window.history.replaceState = originalReplaceState;
            window.removeEventListener('popstate', handleLocationChange);
            window.removeEventListener('codex:locationchange', handleLocationChange);
        };
    }, []);

    useEffect(() => {
        if (activeVerseContentMode !== 'album') {
            setLastNonAlbumVerseContentMode(activeVerseContentMode);
        }
        if (typeof window !== 'undefined') {
            localStorage.setItem('yoga-verse-content-mode', activeVerseContentMode);
        }
    }, [activeVerseContentMode]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsDesktopSidebarOpen(true);
                setIsSidebarOpen(false);
                setActiveRightPanel(null);
                localStorage.setItem('yoga-desktop-sidebar', 'true');
                return;
            }

            // 좁은 화면에서는 모바일 사이드바를 기본적으로 닫아둔다 (대안 1 적용으로 상단 칩 배너가 대체함).
            setIsSidebarOpen(false);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isDesktopSidebarOpen]);

    const toggleSidebar = useCallback(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen((prev) => !prev);
            return;
        }

        if (!isDesktopSidebarOpen) {
            setIsDesktopSidebarOpen(true);
            localStorage.setItem('yoga-desktop-sidebar', 'true');
        }
    }, [isDesktopSidebarOpen]);

    const toggleRightPanel = useCallback((panel: 'commentary') => {
        if (window.innerWidth < 1024) {
            setActiveRightPanel((prev) => (prev === panel ? null : panel));
            return;
        }

        const newState = activeDesktopRightPanel === panel ? null : panel;
        setActiveDesktopRightPanel(newState);
        localStorage.setItem('yoga-desktop-right-panel', JSON.stringify(newState));
    }, [activeDesktopRightPanel]);

    const closeAllDrawers = useCallback(() => {
        setIsSidebarOpen(false);
        setActiveRightPanel(null);
    }, []);

    return (
        <UIContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
                isDesktopSidebarOpen,
                toggleSidebar,
                activeVerseContentMode,
                setActiveVerseContentMode,
                lastVersePath,
                lastNonAlbumVerseContentMode,
                activeRightPanel,
                setActiveRightPanel,
                activeDesktopRightPanel,
                setActiveDesktopRightPanel,
                toggleRightPanel,
                closeAllDrawers,
            }}
        >
            {children}
        </UIContext.Provider>
    );
};

export const useUI = (): UIContextType => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
