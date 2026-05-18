export const DESKTOP_VERSE_COLUMNS_DEFAULT = 'minmax(21rem, 27.5rem) minmax(0, 1fr) minmax(22rem, 24.5rem)';
export const DESKTOP_VERSE_COLUMNS_LEFT_CLOSED = '0px minmax(0, 1fr) minmax(22rem, 24.5rem)';
export const DESKTOP_VERSE_COLUMNS_NO_RIGHT = DESKTOP_VERSE_COLUMNS_DEFAULT;
export const DESKTOP_VERSE_COLUMNS_FULL_WIDTH = DESKTOP_VERSE_COLUMNS_LEFT_CLOSED;

export const getDesktopVerseColumns = (isDesktopSidebarOpen: boolean, _isDesktopRightPanelOpen: boolean) => {
    // Keep the left rail and content lane asymmetrical by state while the right reading column stays fixed.
    return isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_DEFAULT : DESKTOP_VERSE_COLUMNS_LEFT_CLOSED;
};
