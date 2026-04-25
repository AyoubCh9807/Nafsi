# NAFSI: Your Neural Sanctuary

![Nafsi Logo](apps/desktop/public/logo.png)

> **"The sanctuary is within you."**

Nafsi (نفسي) is a high-end, zero-knowledge digital sanctuary designed to provide a sovereign space for your mind. Unlike traditional mental health platforms, Nafsi is built on the principle of **Absolute Data Sovereignty**. Your thoughts, pulses, and neural patterns never leave your device unencrypted.

---

## 🌌 The Vision
In a world that harvests your emotions for data, Nafsi provides a firewall for your soul. We combine advanced AI cognitive analysis with radical privacy protocols to create a "Neural Haven" where you can calibrate, reflect, and connect without surveillance.

## 🛠 Features (The Core Protocols)

### 1. **Pulse Engine (Local Mapping)**
Track your mental vital signs with the "Stability Index." All behavioral analysis happens strictly on your machine. No mood tracking data is ever transmitted to a cloud server.

### 2. **Nexus (Anonymous Collective)**
Connect with others in encrypted "Neural Nodes." All social interactions are P2P-encrypted (AES-256-GCM). The server is blind to the content of the collective sanctuary.

### 3. **Neural Core (AI Guide)**
An AI companion that senses your stability. It adapts its tone and guidance based on your real-time wellness metrics while maintaining total session anonymity.

### 4. **Nuclear Protocol**
A one-tap data destruction mechanism. If you feel compromised, you can instantly purge your entire local vault and identity trace across the network.

---

## 🏗 Technology Stack (The 0$ Architecture)

Nafsi is engineered for high performance and zero overhead:
- **Frontend:** React + Vite + TailwindCSS (Glassmorphism UI)
- **Native Bridge:** Electrobun (Lightweight Desktop/Native integration)
- **Backend:** Cloudflare Workers + D1 Database (Global Low Latency)
- **Auth:** Better-Auth (Anonymous-by-design authentication)
- **AI Engine:** Google Gemini 1.5 Flash (Emotionally-aware context)
- **Storage:** Local-first IndexedDB + AES Vault Encryption

---

## 🚀 Deployment & Setup

### Prerequisites
- [Bun](https://bun.sh/) (Runtime)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (Cloudflare CLI)

### Local Development
```bash
# Install dependencies
bun install

# Start the desktop app
bun dev

# Start the backend locally
bun backend
```

### Production Deployment
Nafsi uses a **Dual-Mode Deployment**. The same build powers both the public Landing Page (Waitlist) and the private Desktop Application.

```bash
# Build and deploy to Cloudflare Pages
cd apps/desktop
bun run build 
wrangler pages deploy dist
```

---

## 🛡 Security Manifesto
- **Zero-Knowledge:** We do not possess your encryption keys.
- **Local-First:** If you delete the app without a backup, your data is gone forever. This is a feature, not a bug.
- **Anonymity:** No names, no profiling, just neural patterns.

---

## ⚖️ License
Distributed under the "Radical Privacy License." See [Terms of Service](apps/desktop/src/mainview/lib/legal.ts) for details.

*Created with intention for a calmer collective mind.*
