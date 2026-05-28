import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchYogaData, resetCache } from './dataFetcher';

describe('fetchYogaData', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        resetCache();
    });

    it('should merge prayers before the book and normalize the runtime contract', async () => {
        const mockPrayers = [
            {
                id: 'prayer-1',
                chapterName: '예비 기도 1',
                verses: [
                    {
                        id: '1.1',
                        title: 'Prayer title 1',
                        chapterTitle: 'Prayer chapter title 1',
                        text: { english: 'Prayer body 1' },
                        audioUrl: 'https://example.com/prayer-1.mp3',
                    },
                ],
            },
        ];

        const mockBook = [
            {
                id: 'book-1',
                chapterName: '본편 1부',
                subchapters: [
                    {
                        id: 'chapter-1-0',
                        chapterName: '소제목',
                        verses: [
                            {
                                id: '1',
                                title: 'Book title 1',
                                chapterTitle: 'Book chapter title 1',
                                text: {
                                    tibetan: 'བོད་ཡིག',
                                    english: 'Book body 1',
                                    korean: [
                                        {
                                            translator: '정창영',
                                            text: '정창영 번역 본문 1',
                                        },
                                        {
                                            translator: '중암 선혜',
                                            text: '중암 선혜 번역 본문 1',
                                        },
                                        {
                                            translator: '류시화',
                                            text: '류시화 번역 본문 1',
                                        },
                                    ],
                                },
                                audioUrl: 'https://example.com/book-1.mp3',
                            },
                        ],
                    },
                ],
            },
        ];

        global.fetch = vi.fn().mockImplementation((url: string) => {
            if (url === '/prayers.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockPrayers,
                });
            }

            if (url === '/book.json') {
                return Promise.resolve({
                    ok: true,
                    json: async () => mockBook,
                });
            }

            return Promise.resolve({ ok: false, status: 404 });
        }) as typeof fetch;

        const data = await fetchYogaData();
        const chapters = Object.values(data).sort((left, right) => left.chapter - right.chapter);

        expect(chapters).toHaveLength(2);
        expect(chapters[0].meta.sectionLabel).toBe('중간계와 관련된 예비 기도');
        expect(chapters[1].meta.sectionLabel).toBe('본문');
        expect(chapters[0].sutras[0].displayTitle).toBe('Prayer title 1');
        expect(chapters[0].sutras[0].audioUrl).toBe('https://example.com/prayer-1.mp3');
        expect(chapters[1].sutras[0].displayTitle).toBe('Book title 1');
        expect(chapters[1].sutras[0].translation_ham).toBe('정창영 번역 본문 1');
        expect(chapters[1].sutras[0].translation_joongam).toBe('중암 선혜 번역 본문 1');
        expect(chapters[1].sutras[0].translation_ryu).toBe('류시화 번역 본문 1');
    });

    it('should throw when either source cannot be fetched', async () => {
        global.fetch = vi.fn().mockImplementation((url: string) => {
            if (url === '/prayers.json') {
                return Promise.resolve({ ok: false, status: 404 });
            }

            return Promise.resolve({
                ok: true,
                json: async () => [],
            });
        }) as typeof fetch;

        await expect(fetchYogaData()).rejects.toThrow('Failed to fetch prayers data: 404');
    });
});
