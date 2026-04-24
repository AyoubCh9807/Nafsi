import { encryptData, decryptData } from "./crypto";

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

const STORAGE_KEY = "nafsi_vault_blob";

export const DEFAULT_SETTINGS: AppSettings = {
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

/**
 * NEW: Asynchronous load since WebCrypto is async.
 */
export const loadSecurePreferences = async (): Promise<AppSettings> => {
    try {
        const encrypted = localStorage.getItem(STORAGE_KEY);
        if (encrypted) {
            const decrypted = await decryptData(encrypted);
            if (decrypted) {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(decrypted) };
            }
        }
    } catch (e) {
        console.error("Vault decryption failed", e);
    }
    return DEFAULT_SETTINGS;
};

export const saveSecurePreferences = async (settings: Partial<AppSettings>) => {
    try {
        // We need the current decrypted state to merge
        const current = await loadSecurePreferences();
        const updated = { ...current, ...settings };
        const encrypted = await encryptData(JSON.stringify(updated));
        localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (e) {
        console.error("Vault encryption failed", e);
    }
};
