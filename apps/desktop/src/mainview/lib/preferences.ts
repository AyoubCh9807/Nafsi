
export interface AppSettings {
    hasOnboarded: boolean;
    userData: {
        language: string;
        ageVerified: boolean;
        identityId: string;
        isPremium: boolean;
        theme: 'dark' | 'light';
    };
    lastRoute: string;
}

const STORAGE_KEY = "nafsi_preferences";

const DEFAULT_SETTINGS: AppSettings = {
    hasOnboarded: false,
    userData: {
        language: "en",
        ageVerified: false,
        identityId: "8821-X",
        isPremium: false,
        theme: 'dark',
    },
    lastRoute: "/pulse",
};

export const getPreferences = (): AppSettings => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error("Failed to load preferences", e);
    }
    return DEFAULT_SETTINGS;
};

export const savePreferences = (settings: Partial<AppSettings>) => {
    try {
        const current = getPreferences();
        const updated = { ...current, ...settings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Failed to save preferences", e);
    }
};
