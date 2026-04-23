import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { anonymous, magicLink } from "better-auth/plugins";
import * as schema from "./db/schema";
import { DrizzleD1Database } from "drizzle-orm/d1";

export const getAuth = (db: DrizzleD1Database<typeof schema>, env: any) => betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification
        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID || "PLACEHOLDER",
            clientSecret: env.GOOGLE_CLIENT_SECRET || "PLACEHOLDER",
        },
        apple: {
            clientId: env.APPLE_CLIENT_ID || "PLACEHOLDER",
            clientSecret: env.APPLE_CLIENT_SECRET || "PLACEHOLDER",
        }
    },
    plugins: [
        anonymous({
            emailDomainName: "anonymous.sanctuary.com",
        }),
        magicLink({
            sendMagicLink: async ({ email, url, token }, request) => {
                // TODO: Integrate with an email provider like Resend or SendGrid
                console.log(`Sending Magic Link to ${email}: ${url}`);
            },
        })
    ],
    rateLimit: {
        enabled: true,
        max: 10, // 10 requests
        window: 60, // 1 minute
    }
});
