import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

export type RightPanelType = 'reflections' | 'commentary' | null;

interface UIContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    isDesktopSidebarOpen: boolean;
    toggleSidebar: () => void;
    
    // Union status for right panel
    activeRightPanel: RightPanelType;
    setActiveRightPanel: Dispatch<SetStateAction<RightPanelType>>;
    activeDesktopRightPanel: RightPanelType;
    setActiveDesktopRightPanel: Dispatch<SetStateAction<RightPanelType>>;
    toggleRightPanel: (panel: 'reflections' | 'commentary') => void;
    
    closeAllDrawers: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
    children: ReactNode;
}

export const UIProvider = ({ children }: UIProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeRightPanel, setActiveRightPanel] = useState<RightPanelType>(null);

    // Desktop Panel States
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
            // If stored as boolean previously, convert it
            if (saved === 'true') return 'reflections';
            if (saved === 'false') return null;
            return saved !== null ? JSON.parse(saved) as RightPanelType : 'reflections';
        }
        return 'reflections';
    });

    const toggleSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(prev => !prev);
        } else {
            const newState = !isDesktopSidebarOpen;
            setIsDesktopSidebarOpen(newState);
            localStorage.setItem('yoga-desktop-sidebar', JSON.stringify(newState));
        }
    };

    const toggleRightPanel = (panel: 'reflections' | 'commentary') => {
        if (window.innerWidth < 1024) {
            setActiveRightPanel(prev => prev === panel ? null : panel);
        } else {
            const newState = activeDesktopRightPanel === panel ? null : panel;
            setActiveDesktopRightPanel(newState);
            localStorage.setItem('yoga-desktop-right-panel', JSON.stringify(newState));
        }
    };

    const closeAllDrawers = () => {
        setIsSidebarOpen(false);
        setActiveRightPanel(null);
    };

    return (
        <UIContext.Provider value={{
            isSidebarOpen,
            setIsSidebarOpen,
            isDesktopSidebarOpen,
            toggleSidebar,
            activeRightPanel,
            setActiveRightPanel,
            activeDesktopRightPanel,
            setActiveDesktopRightPanel,
            toggleRightPanel,
            closeAllDrawers
        }}>
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
