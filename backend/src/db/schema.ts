import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

// ─── USER ─────────────────────────────────────────────
// Anonymous by design. No PII in base table. Ever.

export const user = sqliteTable("user", {
    id: text("id").primaryKey(),                    // nanoid (21 chars)

    // Better Auth Core Requirements (Minimum PII)
    name: text("name").notNull(),                    // Defaults to "Anonymous"
    email: text("email").notNull().unique(),         // Managed by Anonymous plugin/Linker
    emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
    image: text("image"),

    isAnonymous: integer("is_anonymous", { mode: "boolean" }).notNull().default(true),
    linkedAt: integer("linked_at", { mode: "timestamp_ms" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
    index("idx_user_anonymous").on(table.isAnonymous), // fast queries for "unlinked souls"
    index("idx_user_created").on(table.createdAt),     // cohort analysis, retention
]);

// ─── SESSION ──────────────────────────────────────────
// Short-lived. No metadata leakage. D1 TTL handles cleanup.

export const session = sqliteTable("session", {
    id: text("id").primaryKey(),                    // nanoid
    token: text("token").notNull().unique(),         // opaque, 32+ bytes random
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
    index("idx_session_token").on(table.token),      // auth lookup (hot path)
    index("idx_session_user").on(table.userId),      // revoke all sessions for user
    index("idx_session_expires").on(table.expiresAt), // cleanup job / D1 TTL
]);

// ─── ACCOUNT ──────────────────────────────────────────
// Identity providers live here, not in user. Email-OTP is a provider.

export const account = sqliteTable("account", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    providerId: text("provider_id").notNull(),       // "email-otp", "apple", "google"
    accountId: text("account_id").notNull(),         // provider's sub/id (hashed if sensitive)

    // OAuth only—nullable for OTP
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    scope: text("scope"),

    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
    index("idx_account_provider").on(table.providerId, table.accountId), // login lookup
    index("idx_account_user").on(table.userId),     // "what's linked to this soul?"
]);

// ─── VERIFICATION ─────────────────────────────────────
// OTP codes. Aggressive expiry. Single-use.

export const verification = sqliteTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),        // email or phone (normalized)
    value: text("value").notNull(),                  // bcrypt hash of OTP, never plaintext
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    usedAt: integer("used_at", { mode: "timestamp_ms" }), // null until consumed, prevents replay
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
    index("idx_verification_identifier").on(table.identifier, table.createdAt), // latest code lookup
    index("idx_verification_expires").on(table.expiresAt), // cleanup
]);

// ─── USER_PREFERENCE ──────────────────────────────────
// Cultural engine data. Unencrypted, operational. Small, static per user.

export const userPreference = sqliteTable("user_preference", {
    userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),

    region: text("region").notNull(),                // "tunisia", "gcc", "egypt", "levant", "diaspora"
    locale: text("locale").notNull().default("darija"), // "darija", "msa", "egyptian", "levantine", "fr", "en"

    // Mental health framework
    framework: text("framework").notNull().default("cbt"), // "cbt", "trauma-informed", "islamic"

    // Crisis routing
    crisisResourceId: text("crisis_resource_id"),    // FK to crisis_resources table

    // Feature flags / AB testing
    experimentGroup: text("experiment_group"),       // "control", "variant-a"

    updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => [
    index("idx_pref_region").on(table.region),       // regional rollout, resource allocation
    index("idx_pref_framework").on(table.framework), // prompt routing to Mistral
]);

// ─── CRISIS_RESOURCE ──────────────────────────────────
// Static lookup table. Regional hotlines, auto-dial configs.

export const crisisResource = sqliteTable("crisis_resource", {
    id: text("id").primaryKey(),
    region: text("region").notNull().unique(),       // one primary resource per region
    name: text("name").notNull(),                    // "190 - Tunisian Emergency"
    phoneNumber: text("phone_number").notNull(),
    alternativeNumbers: text("alternative_numbers"), // JSON array: ["71-xxx", "93-xxx"]
    url: text("url"),                                // optional web resource
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
});
