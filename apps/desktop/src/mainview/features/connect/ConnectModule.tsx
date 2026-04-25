import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  Send,
  Flag
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../../components/ui/Header";
import { Skeleton } from "../../components/ui/Skeleton";

import { Switch, Route, useLocation, Redirect } from "wouter";

export function ConnectModule({ isDecoyMode }: { isDecoyMode?: boolean }) {
  return (
    <Switch>
      <Route path="/connect"><ConnectMain isDecoyMode={isDecoyMode} /></Route>
      <Route path="/nexus"><ConnectMain isDecoyMode={isDecoyMode} /></Route>
      <Route path="/connect/room"><ConnectRoom isDecoyMode={isDecoyMode} /></Route>
      <Route path="/nexus/room"><ConnectRoom isDecoyMode={isDecoyMode} /></Route>
      <Route path="/connect/create"><ConnectCreate isDecoyMode={isDecoyMode} /></Route>
      <Route path="/nexus/create"><ConnectCreate isDecoyMode={isDecoyMode} /></Route>
      <Route><Redirect to="/nexus" /></Route>
    </Switch>
  );
}

function ConnectMain({ isDecoyMode }: { isDecoyMode?: boolean }) {
  const [location, setLocation] = useLocation();
  const base = location.startsWith("/nexus") ? "/nexus" : "/connect";
  const [connecting, setConnecting] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/nexus/rooms`);
        if (response.ok) {
          const data = await response.json();
          setRooms(data);
        }
      } catch (e) {
        console.error("Failed to sync with Nexus", e);
      } finally {
        setConnecting(false);
      }
    }
    fetchRooms();
  }, []);

  return (
    <div className="h-full overflow-y-auto pb-32">
      <Header
        title={isDecoyMode ? "Discussion Hub" : "The Nexus"}
        subtitle={isDecoyMode ? "Connect with others" : "Anonymous Collective"}
      />
      <div className="p-6 space-y-8">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-700 mb-4 px-2">
            {isDecoyMode ? "Active General Channels" : "Live Sanctuary Rooms"}
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {connecting ? (
              [...Array(3)].map((_, i) => (
                <React.Fragment key={i}>
                  <Skeleton className="h-28 w-full" />
                </React.Fragment>
              ))
            ) : rooms.length === 0 ? (
              <div className="text-center py-12 glass-panel opacity-50 border-dashed border-white/5 rounded-2xl">
                <p className="text-[9px] uppercase font-black text-slate-500 tracking-[0.2em]">No Active Nodes Found</p>
              </div>
            ) : (
              rooms.map((room, i) => (
                <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <RoomCard
                    title={room.name}
                    active={Math.floor(Math.random() * 20)}
                    type={room.category}
                    color={i % 2 === 0 ? "text-pulse-cyan" : "text-pulse-purple"}
                    onClick={() => setLocation(`${base}/room?id=${room.id}`)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>

        <button onClick={() => setLocation(`${base}/create`)} className="w-full py-5 glass-panel flex items-center justify-center gap-3 border-dashed border-white/10 group hover:border-pulse-cyan/40">
          <Plus className="text-slate-600 group-hover:text-pulse-cyan" />
          <span className="font-bold text-xs uppercase tracking-widest">Construct New Space</span>
        </button>
      </div>
    </div>
  );
}


import { encryptData, decryptData } from "../../lib/crypto";
import { authClient } from "../../lib/auth-client";

function ConnectRoom({ isDecoyMode }: { isDecoyMode?: boolean }) {
  const [location, setLocation] = useLocation();
  const base = location.startsWith("/nexus") ? "/nexus" : "/connect";
  const { data: session } = authClient.useSession();

  const searchParams = new URLSearchParams(window.location.search);
  const roomId = searchParams.get("id");

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (!roomId) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/nexus/rooms/${roomId}/messages`);
      if (response.ok) {
        const rawMessages = await response.json();

        // Decrypt messages
        const decryptedMessages = await Promise.all(rawMessages.map(async (msg: any) => {
          const decrypted = await decryptData(msg.content, roomId);
          return {
            ...msg,
            content: decrypted || "[Decryption Failed]"
          };
        }));

        setMessages(decryptedMessages);
      }
    } catch (e) {
      console.error("Failed to fetch messages", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!roomId) return;

    // Initial fetch
    fetchMessages();

    // Setup SSE Stream for real-time updates
    const eventSource = new EventSource(`${import.meta.env.VITE_AUTH_URL}/api/nexus/rooms/${roomId}/stream`, {
      withCredentials: true
    });

    eventSource.addEventListener("sync", async (event) => {
      const rawMessages = JSON.parse(event.data);
      const decryptedMessages = await Promise.all(rawMessages.map(async (msg: any) => {
        const decrypted = await decryptData(msg.content, roomId);
        return {
          ...msg,
          content: decrypted || "[Decryption Failed]"
        };
      }));
      setMessages(decryptedMessages);
      setLoading(false);
    });

    eventSource.onerror = (e) => {
      console.error("SSE Connection Failed", e);
      // Fallback to polling if SSE fails
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    };

    return () => {
      eventSource.close();
    };
  }, [roomId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !roomId || isSending || !session) return;
    setIsSending(true);
    try {
      const encrypted = await encryptData(inputText, roomId);
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/nexus/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: encrypted, type: "text" })
      });

      if (response.ok) {
        setInputText("");
        fetchMessages();
      }
    } catch (e) {
      console.error("Failed to send message", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative bg-[#050508]">
      <Header
        title={isDecoyMode ? "Discussion Room" : "ANONYMOUS_VOID"}
        subtitle={isDecoyMode ? "Shared Space" : `${messages.length} SYNCED LOGS`}
        leftIcon={<ChevronLeft />}
        onLeftClick={() => setLocation(base)}
      />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center py-8">
          <span className="text-[9px] uppercase tracking-widest text-slate-800 font-bold bg-white/5 py-1 px-4 rounded-full">
            {isDecoyMode ? "Open Discussion Channel" : "Encrypted P2P Nexus Protocol Active"}
          </span>
        </div>

        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-3/4" />)
        ) : messages.length === 0 ? (
          <div className="text-center py-20 opacity-20">
            <p className="text-[10px] uppercase font-black tracking-widest">No neural activity detected</p>
          </div>
        ) : (
          messages.map((msg) => (
            <RoomMessage
              key={msg.id}
              user={isDecoyMode ? `user_${msg.userId.slice(0, 4)}` : `GHOST_${msg.userId.slice(0, 4)}`}
              text={msg.content}
              isOwn={session?.user?.id === msg.userId}
              onReport={async () => {
                if (confirm("Report this message for moderation?")) {
                  await fetch(`${import.meta.env.VITE_AUTH_URL}/api/nexus/report`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ targetId: msg.id, targetType: "message", reason: "Violates community guidelines" })
                  });
                  alert("Reported. Neural nodes are analyzing.");
                }
              }}
            />
          ))
        )}
      </div>
      <div className="p-6 pb-24 flex items-center gap-4 bg-void/50 backdrop-blur-md">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-surface-low border-b border-white/5 px-4 py-4 font-arabic text-on-surface focus:outline-none focus:border-pulse-cyan transition-all"
          placeholder={isSending ? "Syncing..." : "Transmit thought..."}
          disabled={isSending}
        />
        <button
          onClick={handleSendMessage}
          disabled={isSending || !inputText.trim()}
          className="p-3 bg-pulse-cyan text-void rounded-lg disabled:opacity-50 transition-all active:scale-95"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}


function ConnectCreate({ isDecoyMode }: { isDecoyMode?: boolean }) {
  const [location, setLocation] = useLocation();
  const base = location.startsWith("/nexus") ? "/nexus" : "/connect";
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Growth");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name || isCreating) return;
    setIsCreating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/nexus/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, description: isDecoyMode ? "Public discussion" : "Private sanctuary space" })
      });
      if (response.ok) {
        setLocation(base);
      }
    } catch (e) {
      console.error("Failed to construct space", e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-void">
      <Header title={isDecoyMode ? "New Discussion" : "Construct Space"} leftIcon={<ChevronLeft />} onLeftClick={() => setLocation(base)} />
      <div className="p-8 space-y-8 overflow-y-auto pb-32">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500 px-1">Room Designation</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-low border-b border-white/5 py-4 px-4 text-xl text-white focus:outline-none focus:border-pulse-purple transition-all"
              placeholder={isDecoyMode ? "e.g. Cinema Talk" : "e.g. Deep Silence"}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500 px-1">Category Core</label>
            <div className="grid grid-cols-2 gap-2">
              {(isDecoyMode ? ["Social", "Hobbies", "Tech", "General"] : ["Growth", "Support", "Crisis", "Venting", "Quiet", "Work"]).map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`py-4 glass-panel text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] ${category === c ? 'border-pulse-purple bg-pulse-purple/10 text-white' : 'border-white/5 text-slate-500'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-500 px-1">Privacy Layer</label>
            <div className="glass-panel p-6 space-y-4">
              <div className="flex justify-between items-center text-left">
                <div>
                  <p className="text-white font-bold text-sm">{isDecoyMode ? "Public Access" : "Anonymous Only"}</p>
                  <p className="text-[9px] text-slate-500 uppercase">{isDecoyMode ? "Open to everyone" : "Hide all user profiles"}</p>
                </div>
                <div className="w-10 h-5 bg-pulse-purple rounded-full p-0.5 flex justify-end">
                  <div className="w-4 h-4 bg-void rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center text-left">
                <div>
                  <p className="text-white font-bold text-sm">Self-Destruct</p>
                  <p className="text-[9px] text-slate-500 uppercase">Wipe history every 24h</p>
                </div>
                <div className="w-10 h-5 bg-surface-low rounded-full p-0.5 flex justify-start">
                  <div className="w-4 h-4 bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name || isCreating}
          className="w-full py-6 bg-pulse-purple text-white font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(155,93,229,0.3)] transition-standard active:scale-95 disabled:opacity-50"
        >
          {isCreating ? "Initializing..." : isDecoyMode ? "Create Discussion" : "Initialize Space"}
        </button>
      </div>
    </div>
  );
}

function RoomMessage({ user, text, isOwn, onReport }: { user: string, text: string, isOwn?: boolean, onReport?: () => void }) {
  return (
    <div className={`group flex flex-col gap-1 max-w-[80%] ${isOwn ? 'ml-auto items-end' : 'items-start'}`}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono tracking-widest text-slate-700 font-bold uppercase">{user}</span>
        {!isOwn && (
          <button
            onClick={onReport}
            className="opacity-0 group-hover:opacity-100 text-slate-700 hover:text-pulse-pink transition-all"
          >
            <Flag size={10} />
          </button>
        )}
      </div>
      <div className={`p-4 rounded-xl border border-white/5 ${isOwn ? 'bg-pulse-cyan text-void font-bold shadow-[0_0_15px_rgba(0,245,212,0.2)]' : 'glass-panel text-slate-300'}`}>
        <p className="text-sm font-arabic leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function RoomCard({
  title,
  active,
  type,
  color,
  onClick
}: {
  title: string;
  active: number;
  type: string;
  color: string;
  onClick: () => void;
}) {
  const displayCount = Math.min(active, 3);
  const overflow = active - displayCount;

  return (
    <button
      onClick={onClick}
      className="glass-panel p-6 flex items-center justify-between group hover:bg-surface-high transition-all border-white/5 w-full text-left"
    >
      <div className="space-y-1">
        <span className={`text-[10px] uppercase font-black tracking-widest ${color}`}>
          {type}
        </span>
        <h4 className="text-2xl font-display font-black text-on-surface tracking-tighter uppercase">
          {title}
        </h4>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex -space-x-1.5">
          {active === 0 ? (
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-700" />
          ) : (
            <>
              {[...Array(displayCount)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-slate-800 border-2 border-void group-hover:bg-slate-700 transition-colors"
                />
              ))}
              {overflow > 0 && (
                <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-void flex items-center justify-center">
                  <span className="text-[8px] font-bold text-slate-400">+{overflow}</span>
                </div>
              )}
            </>
          )}
        </div>

        <span className={`
          text-[9px] font-bold uppercase tracking-widest
          ${active > 0 ? 'text-slate-500' : 'text-slate-700'}
        `}>
          {active > 0 ? `${active} SYNCED` : 'EMPTY'}
        </span>
      </div>
    </button>
  );
}