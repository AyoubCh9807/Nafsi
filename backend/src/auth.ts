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
    user: {
        additionalFields: {
            hasOnboarded: {
                type: "boolean",
                required: false,
                defaultValue: false
            },
            decoyPassphrase: {
                type: "string",
                required: false
            }
        }
    },
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
                const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${env.SENDGRID_API_KEY}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        personalizations: [{ to: [{ email }] }],
                        from: { email: "auth@nafsi.app", name: "NAFSI Sanctuary" },
                        subject: "Your Sanctuary Access Link",
                        content: [{
                            type: "text/html",
                            value: `
                                <div style="font-family: sans-serif; background: #050508; color: #fff; padding: 40px; border-radius: 20px; text-align: center;">
                                    <h1 style="color: #00f5d4; font-size: 40px; margin-bottom: 10px;">نفسي</h1>
                                    <p style="color: #94a3b8; font-size: 18px;">Touch the button below to sync with your sanctuary.</p>
                                    <a href="${url}" style="display: inline-block; background: #00f5d4; color: #050508; padding: 16px 32px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-top: 20px;">SYNC_ACCESS</a>
                                    <p style="margin-top: 30px; font-size: 12px; color: #475569;">If you didn't request this, you can safely ignore this neural ping.</p>
                                </div>
                            `
                        }]
                    })
                });

                if (!response.ok) {
                    console.error("Failed to send SendGrid email:", await response.text());
                }
            },
        })
    ],
    rateLimit: {
        enabled: true,
        max: 10, // 10 requests
        window: 60, // 1 minute
    }
});
