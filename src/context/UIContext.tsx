import { createContext, useContext, useEffect, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';

export type RightPanelType = 'commentary' | null;
export type VerseContentMode = 'body' | 'commentary';

const VERSE_CONTENT_MODE_STORAGE_KEY = 'yoga-verse-content-mode';
const RIGHT_PANEL_STORAGE_KEY = 'yoga-desktop-right-panel';

const isVerseContentMode = (value: string | null): value is VerseContentMode => value === 'body' || value === 'commentary';

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

const readSavedDesktopRightPanel = (): RightPanelType => {
    try {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(RIGHT_PANEL_STORAGE_KEY);

            if (saved === null) {
                return 'commentary';
            }

            if (saved === 'commentary') {
                return 'commentary';
            }

            if (saved === 'null') {
                return null;
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
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 1024;
        }
        return false;
    });
    const [activeVerseContentMode, setActiveVerseContentMode] = useState<VerseContentMode>(readSavedVerseContentMode);
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

    const [activeDesktopRightPanel, setActiveDesktopRightPanel] = useState<RightPanelType>(readSavedDesktopRightPanel);

    useEffect(() => {
        try {
            localStorage.setItem(VERSE_CONTENT_MODE_STORAGE_KEY, activeVerseContentMode);
        } catch (error) {
            console.warn('Unable to access localStorage:', error);
        }
    }, [activeVerseContentMode]);

    useEffect(() => {
        try {
            localStorage.setItem(RIGHT_PANEL_STORAGE_KEY, activeDesktopRightPanel ?? 'null');
        } catch (error) {
            console.warn('Unable to access localStorage:', error);
        }
    }, [activeDesktopRightPanel]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsDesktopSidebarOpen(true);
                setIsSidebarOpen(false);
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

        setActiveDesktopRightPanel((prev) => (prev === panel ? null : panel));
    }, []);

    const closeAllDrawers = useCallback(() => {
        setIsSidebarOpen(false);
        setActiveRightPanel(null);
        setActiveDesktopRightPanel(null);
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
