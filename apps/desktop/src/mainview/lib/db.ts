// --- DATABASE: INDEXED DB VAULT ---
const DB_NAME = "NafsiVault";
const STORES = {
    LOGS: "neural_logs",
    CHAT: "chat_sessions",
    SETTINGS: "app_settings"
};

export const initDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 3); // Upgraded version
        request.onupgradeneeded = () => {
            const db = request.result;
            Object.values(STORES).forEach(store => {
                if (!db.objectStoreNames.contains(store)) {
                    db.createObjectStore(store, { keyPath: "id" });
                }
            });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Generic persistence helpers
export const vaultStore = async (storeName: string, data: any) => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName).put(data);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
    });
};

export const vaultRead = async (storeName: string, id: string) => {
    const db = await initDB();
    return new Promise<any>((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const request = tx.objectStore(storeName).get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const vaultReadAll = async (storeName: string) => {
    const db = await initDB();
    return new Promise<any[]>((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const request = tx.objectStore(storeName).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Compatibility export
export const saveLog = (log: any) => vaultStore(STORES.LOGS, log);
export const getLogs = () => vaultReadAll(STORES.LOGS);
export { STORES };
