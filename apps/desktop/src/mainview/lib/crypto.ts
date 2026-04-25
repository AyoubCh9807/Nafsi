

const ENCRYPTION_KEY_NAME = "nafsi_vault_key";

/**
 * Generates or retrieves a stable encryption key for the local vault.
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

/**
 * Derives a room-specific key from a roomID and the master key.
 * This ensures the server can't read messages even if they have the roomID,
 * and different rooms have different keys.
 */
async function getRoomKey(roomId: string): Promise<CryptoKey> {
    const masterKey = await getEncryptionKey();
    const masterRaw = await crypto.subtle.exportKey("raw", masterKey);

    // Simple derivation for MVP: Hash(MasterKey + RoomID)
    const encoder = new TextEncoder();
    const data = new Uint8Array(masterRaw.byteLength + encoder.encode(roomId).byteLength);
    data.set(new Uint8Array(masterRaw));
    data.set(encoder.encode(roomId), masterRaw.byteLength);

    const hash = await crypto.subtle.digest("SHA-256", data);

    return await crypto.subtle.importKey(
        "raw",
        hash,
        "AES-GCM",
        true,
        ["encrypt", "decrypt"]
    );
}

export async function encryptData(data: string, roomId?: string): Promise<string> {
    const key = roomId ? await getRoomKey(roomId) : await getEncryptionKey();
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

export async function decryptData(encrypted: string, roomId?: string): Promise<string | null> {
    try {
        const key = roomId ? await getRoomKey(roomId) : await getEncryptionKey();
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

