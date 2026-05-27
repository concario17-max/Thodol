import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchYogaData, resetCache } from './dataFetcher';

describe('fetchYogaData', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        resetCache();
    });

    it('should fetch and structure gita data correctly', async () => {
        const mockGita = {
            1: {
                chapter: 1,
                verses: [
                    {
                        id: '1.1',
                        chapter: 1,
                        verse: 1,
                        sanskrit: 'Verse 1.1',
                        iast: 'verse 1.1',
                        audio: 'https://example.com/1.mp3',
                        words: [{ s: 'word', m: 'meaning' }],
                        translation_en: 'English 1.1',
                        commentary_en: 'Commentary 1.1',
                        korean_pronunciation: '발음',
                        translation_gil: '길',
                    },
                ],
            },
            2: {
                chapter: 2,
                verses: [
                    {
                        id: '2.1',
                        chapter: 2,
                        verse: 1,
                        sanskrit: 'Verse 2.1',
                        iast: 'verse 2.1',
                        audio: 'https://example.com/2.mp3',
                        words: [],
                        translation_en: 'English 2.1',
                        commentary_en: 'Commentary 2.1',
                        korean_pronunciation: '발음',
                        translation_gil: '길',
                    },
                ],
            },
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockGita,
        });

        const data = await fetchYogaData();

        expect(data[1]).toBeDefined();
        expect(data[2]).toBeDefined();
        expect(data[1].sutras).toHaveLength(1);
        expect(data[2].sutras).toHaveLength(1);
        expect(data[1].sutras[0].translation_en).toBe('English 1.1');
        expect(data[1].sutras[0].word_meanings?.[0]).toEqual({ word: 'word', meaning: 'meaning' });
    });

    it('should throw on fetch failure', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(fetchYogaData()).rejects.toThrow('Failed to fetch Gita data: 404');
    });
});
