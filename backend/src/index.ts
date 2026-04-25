import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import * as schema from "./db/schema";
import { getAuth } from "./auth";
import { D1Database } from "@cloudflare/workers-types";

type Bindings = {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    SENDGRID_API_KEY: string;
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

app.all("/api/auth/*", (c) => {
    const db = drizzle(c.env.DB, { schema });
    const auth = getAuth(db, c.env);
    return auth.handler(c.req.raw);
});

// Middleware to get session
const getSession = async (c: any) => {
    const db = drizzle(c.env.DB, { schema });
    const auth = getAuth(db, c.env);
    return await auth.api.getSession({ headers: c.req.raw.headers });
};

app.get("/api/nexus/rooms", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const db = drizzle(c.env.DB, { schema });
    const rooms = await db.select().from(schema.room).orderBy(schema.room.createdAt);
    return c.json(rooms);
});

app.post("/api/nexus/rooms", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const db = drizzle(c.env.DB, { schema });
    const { name, category, description } = await c.req.json();

    const newRoom = {
        id: crypto.randomUUID(),
        name,
        category,
        description,
        createdBy: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    await db.insert(schema.room).values(newRoom);
    return c.json(newRoom);
});

app.get("/api/nexus/rooms/:id/messages", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const roomId = c.req.param("id");
    const db = drizzle(c.env.DB, { schema });
    const messages = await db.select()
        .from(schema.message)
        .where(eq(schema.message.roomId, roomId))
        .orderBy(schema.message.createdAt);
    return c.json(messages);
});

app.post("/api/nexus/rooms/:id/messages", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const roomId = c.req.param("id");
    const { content, type } = await c.req.json();
    const db = drizzle(c.env.DB, { schema });

    const newMessage = {
        id: crypto.randomUUID(),
        roomId,
        userId: session.user.id,
        content,
        type: type || "text",
        createdAt: new Date(),
    };

    await db.insert(schema.message).values(newMessage);
    return c.json(newMessage);
});

app.get("/api/nexus/rooms/:id/stream", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const roomId = c.req.param("id");
    const db = drizzle(c.env.DB, { schema });

    return streamSSE(c, async (stream) => {
        let lastId = "";
        while (true) {
            const messages = await db.select()
                .from(schema.message)
                .where(eq(schema.message.roomId, roomId))
                .orderBy(schema.message.createdAt);

            const latest = messages[messages.length - 1];
            if (latest && latest.id !== lastId) {
                lastId = latest.id;
                await stream.writeSSE({
                    data: JSON.stringify(messages),
                    event: "sync",
                    id: String(Date.now()),
                });
            }
            await stream.sleep(2000); // Poll every 2s on server, better than 4s on client
        }
    });
});

app.post("/api/nexus/report", async (c) => {
    const session = await getSession(c);
    if (!session) return c.json({ error: "Unauthorized" }, 401);

    const { targetId, targetType, reason } = await c.req.json();
    const db = drizzle(c.env.DB, { schema });

    const newReport = {
        id: crypto.randomUUID(),
        reportedById: session.user.id,
        targetId,
        targetType,
        reason,
        status: "pending",
        createdAt: new Date(),
    };

    await db.insert(schema.report).values(newReport);
    return c.json({ success: true, reportId: newReport.id });
});

app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default app;
