import { createContext, useContext, useEffect, useState, useCallback, ReactNode, Dispatch, SetStateAction } from 'react';

export type RightPanelType = 'commentary' | null;

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
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
    const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>(null);

    const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
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
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
                setActiveRightPanel(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = useCallback(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen((prev) => !prev);
            return;
        }

        const newState = !isDesktopSidebarOpen;
        setIsDesktopSidebarOpen(newState);
        localStorage.setItem('yoga-desktop-sidebar', JSON.stringify(newState));
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
