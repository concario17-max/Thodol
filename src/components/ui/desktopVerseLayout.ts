export const DESKTOP_VERSE_COLUMNS_DEFAULT = '20% 60% 20%';
export const DESKTOP_VERSE_COLUMNS_LEFT_CLOSED = '0% 60% 40%';

export const getDesktopVerseColumns = (isDesktopSidebarOpen: boolean) =>
    isDesktopSidebarOpen ? DESKTOP_VERSE_COLUMNS_DEFAULT : DESKTOP_VERSE_COLUMNS_LEFT_CLOSED;
