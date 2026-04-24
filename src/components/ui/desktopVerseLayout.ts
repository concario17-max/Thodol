export const DESKTOP_VERSE_COLUMNS_DEFAULT = '360px minmax(0, 1fr)';
export const DESKTOP_VERSE_COLUMNS_LEFT_CLOSED = '0px minmax(0, 1fr)';
export const DESKTOP_VERSE_COLUMNS_NO_RIGHT = '360px minmax(0, 1fr)';
export const DESKTOP_VERSE_COLUMNS_FULL_WIDTH = '0px minmax(0, 1fr)';

export const getDesktopVerseColumns = (isDesktopSidebarOpen: boolean, isDesktopRightPanelOpen: boolean) => {
    if (!isDesktopRightPanelOpen) {
        return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_NO_RIGHT : DESKTOP_VERSE_COLUMNS_FULL_WIDTH;
    }

    return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_DEFAULT : DESKTOP_VERSE_COLUMNS_LEFT_CLOSED;
};
