import { getLogs } from "./db";

export interface Recommendation {
    id: string;
    title: string;
    desc: string;
    type: 'pulse' | 'mind' | 'nexus' | 'security';
    targetPath: string;
    priority: number; // 0 to 1
}

export async function getLocalRecommendations(): Promise<Recommendation[]> {
    const logs = await getLogs();
    const recommendations: Recommendation[] = [];

    const now = Date.now();
    const pulseLogs = logs.filter(l => l.type === 'pulse');
    const lastPulse = pulseLogs.length > 0 ? pulseLogs.sort((a, b) => b.timestamp - a.timestamp)[0] : null;

    // 1. Punctuality Check
    if (!lastPulse || (now - lastPulse.timestamp > 24 * 60 * 60 * 1000)) {
        recommendations.push({
            id: 'daily-pulse',
            title: 'Neural Calibration Required',
            desc: 'Your mental baseline hasn\'t been mapped today. Sync your current state.',
            type: 'pulse',
            targetPath: '/pulse',
            priority: 0.9
        });
    }

    // 2. Distress Response
    if (lastPulse && lastPulse.data.score < 60) {
        recommendations.push({
            id: 'crisis-cbt',
            title: 'Distress Detected',
            desc: 'Your stability index is fluctuating. We recommend a Cognitive Reframing session.',
            type: 'mind',
            targetPath: '/mind',
            priority: 0.95
        });
    }

    // 3. Social Integration
    const workTags = pulseLogs.filter(p => p.data.tags?.includes('Work')).length;
    if (workTags > 3) {
        recommendations.push({
            id: 'nexus-burnout',
            title: 'Professional Decompression',
            desc: 'A heavy work cycle detected. Connect with others in "Deep Rest" Nexus.',
            type: 'nexus',
            targetPath: '/connect',
            priority: 0.7
        });
    }

    // 4. Security Hygiene
    const lastBackup = localStorage.getItem('nafsi_last_backup');
    if (!lastBackup || (now - parseInt(lastBackup)) > 7 * 24 * 60 * 60 * 1000) {
        recommendations.push({
            id: 'vault-safety',
            title: 'Vault Portability Check',
            desc: 'Your encrypted vault hasn\'t been exported recently. Secure your backup pulse.',
            type: 'security',
            targetPath: '/me/data_mgmt',
            priority: 0.6
        });
    }

    // 5. Default Exploration
    if (recommendations.length === 0) {
        recommendations.push({
            id: 'explore-nexus',
            title: 'Collective Expansion',
            desc: 'The sanctuary is stable. Explore shared frequencies in the Nexus.',
            type: 'nexus',
            targetPath: '/connect',
            priority: 0.3
        });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
}
