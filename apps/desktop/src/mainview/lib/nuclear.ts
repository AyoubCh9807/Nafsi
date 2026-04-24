import { authClient } from "./auth-client";

export async function executeNuclearProtocol() {
    // 1. Terminate Session on Server
    try {
        await authClient.signOut();
    } catch (e) {
        console.error("Sign out failed during purge", e);
    }

    // 2. Wipe Local Storage (Vault + Preferences)
    localStorage.clear();

    // 3. Wipe Session Storage (Decoy status, etc)
    sessionStorage.clear();

    // 4. Wipe IndexedDB (if any)
    const dbs = await window.indexedDB.databases();
    dbs.forEach(db => {
        if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
        }
    });

    // 5. Hard Reload to Onboarding
    window.location.href = "/onboarding";
}
