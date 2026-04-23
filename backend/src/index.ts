import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";
import { getAuth } from "./auth";
import { D1Database } from "@cloudflare/workers-types";

type Bindings = {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS
app.use("*", cors({
    origin: (origin) => origin, // Allow all origins for development, refine for production
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
}));

app.on(["POST", "GET"], "/api/auth/**", (c) => {
    const db = drizzle(c.env.DB, { schema });
    const auth = getAuth(db, c.env);
    return auth.handler(c.req.raw);
});

app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
