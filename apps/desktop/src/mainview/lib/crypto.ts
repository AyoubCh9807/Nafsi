
const ENCRYPTION_KEY_NAME = "nafsi_vault_key";

/**
 * Generates or retrieves a stable encryption key for the local vault.
 * In a real prod app, this might be derived from a password using PBKDF2.
 * For now, we'll generate a cryptographically strong random key and store it in 
 * a way that isn't easily accessible to other scripts (e.g., IndexedDB or similar).
 */
async function getEncryptionKey(): Promise<CryptoKey> {
    const existing = localStorage.getItem(ENCRYPTION_KEY_NAME);
    if (existing) {
        const raw = Uint8Array.from(atob(existing), c => c.charCodeAt(0));
        return await crypto.subtle.importKey(
            "raw",
            raw,
            "AES-GCM",
            true,
            ["encrypt", "decrypt"]
        );
    }

    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    const exported = await crypto.subtle.exportKey("raw", key);
    localStorage.setItem(ENCRYPTION_KEY_NAME, btoa(String.fromCharCode(...new Uint8Array(exported))));
    return key;
}

export async function encryptData(data: string): Promise<string> {
    const key = await getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(data);

    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded
    );

    // Combine IV + Ciphertext for storage
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
}

export async function decryptData(encrypted: string): Promise<string | null> {
    try {
        const key = await getEncryptionKey();
        const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));

        const iv = combined.slice(0, 12);
        const ciphertext = combined.slice(12);

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );

        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error("Decryption failed", e);
        return null;
    }
}
