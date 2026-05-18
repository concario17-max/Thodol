export const DESKTOP_VERSE_COLUMNS_DEFAULT = 'minmax(21rem, 27.5rem) minmax(0, 1fr)';
export const DESKTOP_VERSE_COLUMNS_LEFT_CLOSED = '0px minmax(0, 1fr)';
export const DESKTOP_VERSE_COLUMNS_NO_RIGHT = 'minmax(21rem, 27.5rem) minmax(0, 1fr)';
export const DESKTOP_VERSE_COLUMNS_FULL_WIDTH = '0px minmax(0, 1fr)';

export const getDesktopVerseColumns = (isDesktopSidebarOpen: boolean, _isDesktopRightPanelOpen?: boolean) => {
    // Keep the left rail and content lane asymmetrical by state.
    const hasSidebarRail = isDesktopSidebarOpen;

    return hasSidebarRail ? DESKTOP_VERSE_COLUMNS_DEFAULT : DESKTOP_VERSE_COLUMNS_FULL_WIDTH;
};
