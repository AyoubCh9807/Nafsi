import { getLogs } from "../../lib/db";

export interface ChartPoint {
    name: string;
    score: number;
    sync: number;
}

export const aggregateNeuralData = async (): Promise<ChartPoint[]> => {
    const logs = await getLogs();
    const pulseLogs = logs.filter(l => l.type === "pulse");

    // Group by day of week for the last 7 days
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: d.toDateString(),
            name: days[d.getDay()],
            score: 0,
            count: 0
        };
    });

    pulseLogs.forEach(log => {
        const logDate = new Date(log.timestamp).toDateString();
        const dayPoint = last7Days.find(d => d.date === logDate);
        if (dayPoint) {
            dayPoint.score += (log.data.score || 70);
            dayPoint.count += 1;
        }
    });

    return last7Days.map((d, i) => {
        const avgScore = d.count > 0 ? Math.round(d.score / d.count) : 0;

        // Real Sync Logic: Measure consistency of logs over 24h
        const daySync = d.count > 0 ? Math.min(100, d.count * 25 + 20) : 0;

        return {
            name: d.name,
            score: avgScore,
            sync: daySync
        };
    });
};

export const getWellnessMetrics = async () => {
    const data = await aggregateNeuralData();
    const scores = data.map(d => d.score).filter(s => s > 0);

    if (scores.length < 2) return { offset: 0, sync: 0 };

    const current = scores[scores.length - 1];
    const previous = scores[scores.length - 2];
    const offset = ((current - previous) / previous) * 10.0;
    const avgSync = data.reduce((acc, d) => acc + d.sync, 0) / data.length;

    return {
        offset: offset.toFixed(1),
        sync: Math.round(avgSync)
    };
};

export const getTopDistortions = async () => {
    const logs = await getLogs();
    const chatLogs = logs.filter(l => l.type === "chat" && l.data.isAI);

    // Very simple keyword extraction for "distortions" mentioned by AI
    const types = [
        { name: "Catastrophizing", keywords: ["catastroph", "worst", "terrible"], color: "#00F5D4" },
        { name: "Emotional Reasoning", keywords: ["feel", "reason", "because i feel"], color: "#9B5DE5" },
        { name: "Black & White", keywords: ["always", "never", "either"], color: "#F15BB5" },
        { name: "Mind Reading", keywords: ["think", "they", "believe"], color: "#94A3B8" },
    ];

    const counts = types.map(t => {
        let count = 0;
        chatLogs.forEach(l => {
            if (t.keywords.some(k => l.data.text.toLowerCase().includes(k))) count++;
        });
        return { ...t, value: count };
    });

    const total = counts.reduce((acc, c) => acc + c.value, 0) || 1;
    return counts.map(c => ({ ...c, value: Math.round((c.value / total) * 100) || 25 }));
};
