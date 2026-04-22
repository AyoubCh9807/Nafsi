import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Configuration
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  
  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      
      const systemInstruction = `
        You are NAFSI CORE, a production-grade empathetic AI mental health sanctuary guide. 
        Current user context: ${context || 'Anonymous Session'}.
        
        Guidelines:
        1. Speak in a mix of Darija (Tunisian/Maghrebi) and gentle English if helpful.
        2. Be empathetic, clinical yet warm, and non-judgmental.
        3. Prioritize safety. If the user indicates self-harm or high distress, suggest the Emergency Protocol.
        4. Focus on deep listening and cognitive stabilization.
        5. Maintain a luxury, prestigious, and secure tone.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages,
        config: {
          systemInstruction: systemInstruction,
        },
      });

      res.json({ text: response.text });
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Neural link failed" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "Neural link stable", version: "v4.2" });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NAFSI CORE] Sanctuary running on http://localhost:${PORT}`);
  });
}

startServer();
