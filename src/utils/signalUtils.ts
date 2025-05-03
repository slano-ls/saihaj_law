import type { SignalStar } from "@/stores/signalStore";

const MESSAGES = [
    "Emerging volatility in quiet volume",
    "Hesitation in high velocity context",
    "Anomaly in crowd sentiment",
    "Pattern forming in noise",
    "Signal emerging from chaos",
    "Moment of clarity in the void",
    "Whisper of intent in the static",
    "Pulse of awareness in the dark",
    "Flicker of meaning in the noise",
    "Echo of thought in the silence",
    "Ripple of consciousness",
    "Spark of connection",
    "Glimmer of understanding",
    "Shadow of a pattern",
    "Trace of a thought"
];

const CLUSTER_IDS = ["alpha", "beta", "gamma", "delta", "epsilon"];

const CLUSTER_THEMES = {
    alpha: "Emerging patterns",
    beta: "Sentiment shifts",
    gamma: "Volatility clusters",
    delta: "Thought formations",
    epsilon: "Awareness nodes"
};

export function generateInitialSignals(count: number): SignalStar[] {
    const signals: SignalStar[] = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
        const isHot = Math.random() < 0.1; // 10% chance of being a hot signal
        const hasCluster = Math.random() < 0.3; // 30% chance of being in a cluster
        const clusterId = hasCluster ? CLUSTER_IDS[Math.floor(Math.random() * CLUSTER_IDS.length)] : undefined;
        
        // Generate position with slight bias towards center
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 50;
        const height = (Math.random() - 0.5) * 50;
        
        signals.push({
            id: `sig${String(i).padStart(3, "0")}`,
            position: [
                Math.cos(angle) * radius,
                Math.sin(angle) * radius,
                height
            ],
            brightness: Math.random() * 0.8 + 0.2, // Between 0.2 and 1.0
            decayRate: Math.random() * 0.001 + 0.0001, // Between 0.0001 and 0.0011
            clusterId,
            isHot,
            message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
            createdAt: now - Math.random() * 10000 // Random creation time within last 10 seconds
        });
    }
    
    return signals;
}

export function updateSignalPositions(signals: SignalStar[]): SignalStar[] {
    return signals.map(signal => {
        const time = Date.now() * 0.001;
        const driftX = Math.sin(time + parseInt(signal.id.slice(3)) * 0.1) * 0.01;
        const driftY = Math.cos(time + parseInt(signal.id.slice(3)) * 0.2) * 0.01;
        
        // If signal is in a cluster, add slight attraction to cluster center
        let clusterDriftX = 0;
        let clusterDriftY = 0;
        if (signal.clusterId) {
            const clusterIndex = CLUSTER_IDS.indexOf(signal.clusterId);
            const clusterAngle = (clusterIndex / CLUSTER_IDS.length) * Math.PI * 2;
            const clusterRadius = 20;
            const targetX = Math.cos(clusterAngle) * clusterRadius;
            const targetY = Math.sin(clusterAngle) * clusterRadius;
            
            clusterDriftX = (targetX - signal.position[0]) * 0.001;
            clusterDriftY = (targetY - signal.position[1]) * 0.001;
        }
        
        return {
            ...signal,
            position: [
                signal.position[0] + driftX + clusterDriftX,
                signal.position[1] + driftY + clusterDriftY,
                signal.position[2]
            ],
            brightness: Math.max(0, signal.brightness - signal.decayRate)
        };
    });
}

export function applyThreshold(signals: SignalStar[], threshold: number): SignalStar[] {
    return signals.filter(signal => signal.brightness >= threshold);
}

export function getClusterTheme(clusterId: string): string {
    return CLUSTER_THEMES[clusterId as keyof typeof CLUSTER_THEMES] || "Unknown cluster";
} 