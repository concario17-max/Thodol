import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchYogaData, resetCache } from './dataFetcher';

describe('fetchYogaData', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        resetCache();
    });

    it('should fetch and structure yoga data correctly', async () => {
        const mockSutras = [
            { id: '1.1', sanskrit: 'Sutra 1.1', '2.english': 'Eng 1.1' },
            { id: '1.2', sanskrit: 'Sutra 1.2', '2.english': 'Eng 1.2' },
            { id: '2.1', sanskrit: 'Sutra 2.1', '2.english': 'Eng 2.1' },
        ];

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockSutras,
        });

        const data = await fetchYogaData();

        expect(data[1]).toBeDefined();
        expect(data[2]).toBeDefined();
        expect(data[1].sutras).toHaveLength(2);
        expect(data[2].sutras).toHaveLength(1);
        expect(data[1].sutras[0].id).toBe('1.1');
        expect(data[1].sutras[1].id).toBe('1.2');
    });

    it('should throw on fetch failure', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
        });

        await expect(fetchYogaData()).rejects.toThrow('Failed to fetch data: 404');
    });
});
