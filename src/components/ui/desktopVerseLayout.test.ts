import { describe, expect, it } from 'vitest';
import {
    DESKTOP_VERSE_COLUMNS_DEFAULT,
    DESKTOP_VERSE_COLUMNS_FULL_WIDTH,
    getDesktopVerseColumns,
} from './desktopVerseLayout';

describe('getDesktopVerseColumns', () => {
    it('returns the default verse columns when the sidebar is open', () => {
        expect(getDesktopVerseColumns(true)).toBe(DESKTOP_VERSE_COLUMNS_DEFAULT);
    });

    it('returns full width when the sidebar is closed', () => {
        expect(getDesktopVerseColumns(false)).toBe(DESKTOP_VERSE_COLUMNS_FULL_WIDTH);
    });
});
