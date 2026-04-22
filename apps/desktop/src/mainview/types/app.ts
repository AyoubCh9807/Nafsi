export type Module = "onboarding" | "pulse" | "chat" | "mind" | "insights" | "connect" | "emergency" | "me" | "premium";

export interface ChatMessageData {
    text: string;
    isAI: boolean;
    time: string;
    sender: string;
    status?: string;
    id: string;
}

export interface AppState {
    module: Module;
    subScreen: string;
    hasOnboarded: boolean;
    userData: {
        language: string;
        ageVerified: boolean;
        identityId: string;
        isPremium: boolean;
        theme: 'dark' | 'light';
    };
}
