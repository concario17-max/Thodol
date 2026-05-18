import { createContext, useContext, useEffect, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';

export type RightPanelType = 'commentary' | null;
export type VerseContentMode = 'body' | 'commentary';
export type RightPanelContentMode = 'commentary' | 'comic';

const VERSE_CONTENT_MODE_STORAGE_KEY = 'yoga-verse-content-mode';
const RIGHT_PANEL_CONTENT_MODE_STORAGE_KEY = 'yoga-right-panel-content-mode';

const isVerseContentMode = (value: string | null): value is VerseContentMode => value === 'body' || value === 'commentary';
const isRightPanelContentMode = (value: string | null): value is RightPanelContentMode => value === 'commentary' || value === 'comic';

const readSavedVerseContentMode = (): VerseContentMode => {
    try {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(VERSE_CONTENT_MODE_STORAGE_KEY);
            if (isVerseContentMode(saved)) {
                return saved;
            }
        }
    } catch (error) {
        console.warn('Unable to access localStorage:', error);
    }

    return 'commentary';
};

const readSavedRightPanelContentMode = (): RightPanelContentMode => {
    try {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(RIGHT_PANEL_CONTENT_MODE_STORAGE_KEY);
            if (isRightPanelContentMode(saved)) {
                return saved;
            }
        }
    } catch (error) {
        console.warn('Unable to access localStorage:', error);
    }

    return 'commentary';
};

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    activeVerseContentMode: VerseContentMode;
    setActiveVerseContentMode: Dispatch<SetStateAction<VerseContentMode>>;
    rightPanelContentMode: RightPanelContentMode;
    setRightPanelContentMode: Dispatch<SetStateAction<RightPanelContentMode>>;
    activeRightPanel: RightPanelType;
    setActiveRightPanel: Dispatch<SetStateAction<RightPanelType>>;
    activeDesktopRightPanel: RightPanelType;
    setActiveDesktopRightPanel: Dispatch<SetStateAction<RightPanelType>>;
    toggleRightPanel: (panel: 'commentary') => void;
    toggleRightPanelContentMode: () => void;
    closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 1024;
        }
        return false;
    });
    const [activeVerseContentMode, setActiveVerseContentMode] = useState<VerseContentMode>(readSavedVerseContentMode);
    const [rightPanelContentMode, setRightPanelContentMode] = useState<RightPanelContentMode>(readSavedRightPanelContentMode);
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
        try {
            localStorage.setItem(VERSE_CONTENT_MODE_STORAGE_KEY, activeVerseContentMode);
        } catch (error) {
            console.warn('Unable to access localStorage:', error);
        }
    }, [activeVerseContentMode]);

    useEffect(() => {
        try {
            localStorage.setItem(RIGHT_PANEL_CONTENT_MODE_STORAGE_KEY, rightPanelContentMode);
        } catch (error) {
            console.warn('Unable to access localStorage:', error);
        }
    }, [rightPanelContentMode]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsDesktopSidebarOpen(true);
                setIsSidebarOpen(false);
                setActiveRightPanel(null);
                localStorage.setItem('yoga-desktop-sidebar', 'true');
                return;
            }

            setIsSidebarOpen(isDesktopSidebarOpen);
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

    const toggleRightPanelContentMode = useCallback(() => {
        setRightPanelContentMode((prev) => (prev === 'commentary' ? 'comic' : 'commentary'));
    }, []);

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
                rightPanelContentMode,
                setRightPanelContentMode,
                activeRightPanel,
                setActiveRightPanel,
                activeDesktopRightPanel,
                setActiveDesktopRightPanel,
                toggleRightPanel,
                toggleRightPanelContentMode,
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
