import { describe, it, expect, vi } from 'vitest';
import { aggregateNeuralData, getWellnessMetrics } from '../data-aggregator';

// Mock the DB module
vi.mock('../../lib/db', () => ({
    getLogs: vi.fn(),
    STORES: { LOGS: 'neural_logs' }
}));

import { getLogs } from '../../lib/db';

describe('Neural Data Aggregator', () => {
    it('should aggregate logs into 7-day buckets', async () => {
        const mockLogs = [
            { type: 'pulse', timestamp: Date.now(), data: { score: 80 } },
            { type: 'pulse', timestamp: Date.now() - 86400000, data: { score: 60 } }
        ];
        (getLogs as any).mockResolvedValue(mockLogs);

        const data = await aggregateNeuralData();
        expect(data.length).toBe(7);
        expect(data[6].score).toBe(80);
        expect(data[5].score).toBe(60);
    });

    it('should calculate wellness offset correctly', async () => {
        const mockLogs = [
            { type: 'pulse', timestamp: Date.now(), data: { score: 80 } },
            { type: 'pulse', timestamp: Date.now() - 86400000, data: { score: 60 } }
        ];
        (getLogs as any).mockResolvedValue(mockLogs);

        const metrics = await getWellnessMetrics();
        // (80 - 60) / 60 * 10 = 3.33 -> "3.3"
        expect(metrics.offset).toBe("3.3");
    });
});
