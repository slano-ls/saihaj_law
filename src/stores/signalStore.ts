import { create } from 'zustand';

export interface SignalStar {
    id: string;
    position: [number, number, number];
    brightness: number;
    decayRate: number;
    clusterId?: string | undefined;
    isHot?: boolean | undefined;
    message?: string | undefined;
    createdAt: number;
}

interface SignalState {
    signals: SignalStar[];
    threshold: number;
    setThreshold: (value: number) => void;
    updateSignal: (id: string, updates: Partial<SignalStar>) => void;
    addSignal: (signal: SignalStar) => void;
    removeSignal: (id: string) => void;
}

export const useSignalStore = create<SignalState>((set) => ({
    signals: [],
    threshold: 0.5,
    setThreshold: (value: number) => set({ threshold: value }),
    updateSignal: (id: string, updates: Partial<SignalStar>) =>
        set((state: SignalState) => ({
            signals: state.signals.map((signal: SignalStar) =>
                signal.id === id ? { ...signal, ...updates } : signal
            ),
        })),
    addSignal: (signal: SignalStar) =>
        set((state: SignalState) => ({
            signals: [...state.signals, signal],
        })),
    removeSignal: (id: string) =>
        set((state: SignalState) => ({
            signals: state.signals.filter((signal: SignalStar) => signal.id !== id),
        })),
})); 