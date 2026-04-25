import React, { useState, useEffect, useRef } from "react";
import {
    RefreshCcw,
    ChevronLeft,
    Mic,
    Send,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../../components/ui/Header";
import { ChatMessageData } from "../../types/app";
import { getLogs, saveLog } from "../../lib/db";
import { generateResponse, ChatMessage as AIChatMessage } from "../../lib/ai";

import { Switch, Route, useLocation } from "wouter";

export function ChatModule() {
    return (
        <Switch>
            <Route path="/chat" component={ChatMain} />
            <Route path="/chat/live" component={ChatLive} />
            <Route path="/chat/summary" component={ChatSummary} />
        </Switch>
    );
}

function ChatMain() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full flex flex-col">
            <Header title="Neural Link" subtitle="Secure Session Composer" rightIcon={<RefreshCcw size={16} className="m-auto opacity-40" />} />
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-6 glass-panel flex items-center justify-between group cursor-pointer active:scale-[0.98]" onClick={() => setLocation("/chat/live")}>
                    <div className="space-y-1">
                        <h4 className="text-pulse-cyan font-display font-bold uppercase tracking-tight">New Cognitive Session</h4>
                        <p className="text-xs text-slate-600">Start a fresh neural analysis layer.</p>
                    </div>
                    <ArrowRight size={20} className="text-pulse-cyan group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="pt-8"><span className="text-[10px] uppercase font-bold tracking-[0.3em] text-slate-700">Archived Encryptions</span></div>
                <div className="space-y-4 opacity-60">
                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest text-center py-8">Historical logs are stored locally in your Neural Vault.</p>
                </div>
            </div>
        </div>
    );
}

function ChatLive() {
    const [, setLocation] = useLocation();
    const [messages, setMessages] = useState<ChatMessageData[]>([]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        const loadChat = async () => {
            const logs = await getLogs();
            const chatLogs = logs.filter(l => l.type === "chat").sort((a: any, b: any) => a.timestamp - b.timestamp);
            if (chatLogs.length > 0) {
                setMessages(chatLogs.map(l => l.data));
            } else {
                setMessages([{
                    id: "welcome",
                    text: "I am ready to process your thoughts. Any internal conflicts or neural tensions to report?",
                    isAI: true,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sender: "NAFSI"
                }]);
            }
        };
        loadChat();
    }, []);

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        // Rate Limiting Logic (10 msgs / day for free users)
        const logs = await getLogs();
        const today = new Date().setHours(0, 0, 0, 0);
        const dailyAIMessages = logs.filter(l =>
            l.type === "chat" &&
            l.data.isAI &&
            l.timestamp > today
        ).length;

        // Note: For MVP, we assume free if not explicitly premium in local state
        // In a real prod env, this would be verified against the auth session
        const isPremium = false; // Placeholder for premium check

        if (dailyAIMessages >= 10 && !isPremium) {
            setError("DAILY_NEURAL_CAPACITY_REACHED. Upgrade to Premium for unlimited sync.");
            return;
        }

        const userMsg: ChatMessageData = {
            id: Date.now().toString(),
            text: inputText,
            isAI: false,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: "USER",
            status: "SYNCED"
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        saveLog({ id: userMsg.id, type: "chat", data: userMsg, timestamp: Date.now() });

        try {
            // Retrieve past neural echoes (last 20 messages for context)
            const logs = await getLogs();
            const pulseLogs = logs.filter(l => l.type === 'pulse').slice(-1);
            const currentStability = pulseLogs.length > 0 ? pulseLogs[0].data.score : 70;

            const historicalText = logs
                .filter(l => l.type === "chat")
                .slice(-20)
                .map(l => `${l.data.sender}: ${l.data.text}`)
                .join("\n");

            const history: AIChatMessage[] = messages.map(m => ({
                role: m.isAI ? "model" : "user",
                parts: [{ text: m.text }]
            }));
            history.push({ role: "user", parts: [{ text: inputText }] });

            const responseText = await generateResponse(history, historicalText, currentStability);

            const aiMsg: ChatMessageData = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                isAI: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: "NAFSI"
            };

            setMessages(prev => [...prev, aiMsg]);
            saveLog({ id: aiMsg.id, type: "chat", data: aiMsg, timestamp: Date.now() });

            if (responseText.toLowerCase().includes("emergency protocol") || inputText.toLowerCase().includes("help") || inputText.toLowerCase().includes("انتحار")) {
                setTimeout(() => setLocation("/emergency"), 2000);
            }

        } catch (e: any) {
            const errorMsg: ChatMessageData = {
                id: "err",
                text: e.message || "Neural link desynced. Re-establishing...",
                isAI: true,
                time: "ERROR",
                sender: "SYSTEM"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <Header
                title="NAFSI CORE"
                subtitle="Precision V4.2"
                leftIcon={<ChevronLeft />}
                onLeftClick={() => setLocation("/chat")}
                rightIcon={<span className="text-[9px] font-bold text-pulse-cyan m-auto">LIVE</span>}
            />
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 bg-void">
                {messages.map((m) => (
                    <React.Fragment key={m.id}>
                        <ChatMessage isAI={m.isAI} text={m.text} time={m.time} sender={m.sender} status={m.status} />
                    </React.Fragment>
                ))}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 glass-panel border-pulse-pink/20 text-pulse-pink text-[10px] font-black uppercase tracking-[0.2em] text-center"
                    >
                        {error}
                    </motion.div>
                )}
                {isTyping && (
                    <div className="flex items-center gap-4 p-4 glass-panel w-fit rounded-xl animate-in fade-in slide-in-from-left-4">
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: [4, 12, 4],
                                        opacity: [0.3, 1, 0.3]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15
                                    }}
                                    className="w-1 bg-pulse-cyan rounded-full"
                                />
                            ))}
                        </div>
                        <span className="text-[10px] font-display font-medium uppercase tracking-[0.2em] text-pulse-cyan">ANALYZING NEURAL DATA...</span>
                    </div>
                )}
            </div>
            <div className="p-6 pb-32 bg-void border-t border-white/5 flex items-center gap-4">
                <button className="p-3 bg-surface-high rounded-lg text-slate-500 hover:text-pulse-cyan transition-colors"><Mic size={20} /></button>
                <input
                    className="flex-1 bg-transparent border-b border-white/10 px-0 py-4 font-arabic text-on-surface focus:outline-none focus:border-pulse-cyan transition-all"
                    placeholder="عبر عن نفسك..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="p-3 bg-pulse-cyan text-void rounded-lg shadow-lg active:scale-90 transition-transform"><Send size={20} /></button>
            </div>
        </div>
    );
}

function ChatSummary() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full p-8 flex flex-col justify-center items-center text-center space-y-8">
            <Sparkles size={60} className="text-pulse-purple" />
            <h2 className="text-3xl font-display font-black tracking-tight uppercase">Session Cognitive Delta</h2>
            <div className="w-full text-right space-y-4">
                <SummaryItem label="Detected Sentiment" value="Neutral-Heavy" color="text-slate-400" />
                <SummaryItem label="Neural Resolution" value="82%" color="text-pulse-cyan" />
                <SummaryItem label="Insight Extraction" value="Completed" color="text-pulse-purple" />
            </div>
            <button onClick={() => setLocation("/chat")} className="w-full py-5 bg-pulse-cyan text-void font-bold uppercase tracking-widest active:scale-[0.98]">Seal Session</button>
            <button onClick={() => setLocation("/chat")} className="text-pulse-pink font-bold uppercase text-[10px] tracking-widest hover:brightness-125 transition-all">Destroy Trace (Standard Protocol)</button>
        </div>
    );
}

function ChatMessage({ text, isAI, time, sender, status }: { text: string, isAI?: boolean, time?: string, sender?: string, status?: string }) {
    return (
        <div className={`flex flex-col gap-2 max-w-[85%] ${isAI ? 'items-start' : 'items-end ml-auto'}`}>
            <div className={`p-4 rounded-xl border-white/5 shadow-xl ${isAI ? 'glass-panel rounded-tr-none border-l-4 border-l-pulse-purple' : 'bg-pulse-cyan text-void rounded-tl-none font-medium'}`}>
                <p className="text-sm md:text-base leading-relaxed tracking-wide font-arabic">
                    {text}
                </p>
            </div>
            <span className={`text-[10px] font-display tracking-tighter opacity-70 px-1 uppercase ${!isAI ? 'text-pulse-cyan' : 'text-slate-500'}`}>
                {isAI ? `${time} — ${sender}` : status}
            </span>
        </div>
    );
}

function SummaryItem({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="flex justify-between items-center border-b border-white/5 py-4">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">{label}</span>
            <span className={`font-display font-bold text-lg uppercase ${color}`}>{value}</span>
        </div>
    );
}
