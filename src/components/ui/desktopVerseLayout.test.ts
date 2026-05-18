import { describe, expect, it } from 'vitest';
import {
    DESKTOP_VERSE_COLUMNS_DEFAULT,
    DESKTOP_VERSE_COLUMNS_FULL_WIDTH,
    DESKTOP_VERSE_COLUMNS_LEFT_CLOSED,
    DESKTOP_VERSE_COLUMNS_NO_RIGHT,
    getDesktopVerseColumns,
} from './desktopVerseLayout';

describe('getDesktopVerseColumns', () => {
    it('returns 20/60/20 when the left panel is open', () => {
        expect(getDesktopVerseColumns(true, true)).toBe(DESKTOP_VERSE_COLUMNS_DEFAULT);
    });

    it('returns 0/60/20 when the left panel is closed', () => {
        expect(getDesktopVerseColumns(false, true)).toBe(DESKTOP_VERSE_COLUMNS_LEFT_CLOSED);
    });

    it('keeps the fixed right reading column in the layout string', () => {
        expect(getDesktopVerseColumns(true, false)).toBe(DESKTOP_VERSE_COLUMNS_NO_RIGHT);
    });

    it('returns the same fixed right reading column when the left panel is closed', () => {
        expect(getDesktopVerseColumns(false, false)).toBe(DESKTOP_VERSE_COLUMNS_FULL_WIDTH);
    });
});
