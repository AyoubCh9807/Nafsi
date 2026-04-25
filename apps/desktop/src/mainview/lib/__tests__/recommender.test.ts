import { describe, it, expect, vi } from 'vitest';
import { getLocalRecommendations } from '../recommender';

// Mock the DB module
vi.mock('../db', () => ({
    getLogs: vi.fn(),
    STORES: { LOGS: 'neural_logs' }
}));

import { getLogs } from '../db';

describe('Local Recommender Engine', () => {
    it('should recommend daily pulse if no logs exist', async () => {
        (getLogs as any).mockResolvedValue([]);

        const recs = await getLocalRecommendations();
        expect(recs.find(r => r.id === 'daily-pulse')).toBeDefined();
    });

    it('should recommend mind sanctuary if stability score is low', async () => {
        (getLogs as any).mockResolvedValue([
            {
                type: 'pulse',
                timestamp: Date.now(),
                data: { score: 40, tags: ['Work'] }
            }
        ]);

        const recs = await getLocalRecommendations();
        expect(recs.find(r => r.id === 'crisis-cbt')).toBeDefined();
    });

    it('should prioritize security check if no backup in 7 days', async () => {
        (getLogs as any).mockResolvedValue([
            {
                type: 'pulse',
                timestamp: Date.now(),
                data: { score: 90, tags: [] }
            }
        ]);

        // Mock localStorage item missing
        vi.stubGlobal('localStorage', {
            getItem: vi.fn().mockReturnValue(null),
            setItem: vi.fn()
        });

        const recs = await getLocalRecommendations();
        expect(recs.find(r => r.id === 'vault-safety')).toBeDefined();
    });

    it('should recommend Nexus for burnout if many work tags found', async () => {
        (getLogs as any).mockResolvedValue([
            { type: 'pulse', timestamp: Date.now(), data: { score: 80, tags: ['Work'] } },
            { type: 'pulse', timestamp: Date.now(), data: { score: 80, tags: ['Work'] } },
            { type: 'pulse', timestamp: Date.now(), data: { score: 80, tags: ['Work'] } },
            { type: 'pulse', timestamp: Date.now(), data: { score: 80, tags: ['Work'] } }
        ]);

        const recs = await getLocalRecommendations();
        expect(recs.find(r => r.id === 'nexus-burnout')).toBeDefined();
    });
});
