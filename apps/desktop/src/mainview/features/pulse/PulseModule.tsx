import { useState, useEffect } from "react";
import {
    Clock,
    AreaChart,
    ChevronLeft,
    TrendingUp,
    ShieldCheck,
    Sparkles,
    Zap
} from "lucide-react";
import { getLocalRecommendations, Recommendation } from "../../lib/recommender";
import { motion } from "framer-motion";
import { Header } from "../../components/ui/Header";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";
import { getLogs, saveLog } from "../../lib/db";

import { Switch, Route, useLocation, Redirect } from "wouter";

export function PulseModule() {
    const [checkInData, setCheckInData] = useState({ tags: [] as string[], note: "" });

    return (
        <Switch>
            <Route path="/pulse">
                <PulseMain />
            </Route>
            <Route path="/pulse/tags">
                <PulseTags data={checkInData} onUpdate={(d) => setCheckInData(prev => ({ ...prev, ...d }))} />
            </Route>
            <Route path="/pulse/journal">
                <PulseJournal data={checkInData} onUpdate={(d) => setCheckInData(prev => ({ ...prev, ...d }))} />
            </Route>
            <Route path="/pulse/history" component={PulseHistory} />
            <Route path="/pulse/detail" component={PulseDetail} />
            <Route path="/pulse/export">
                <ExportScreen onBack={() => window.history.back()} />
            </Route>
            <Route><Redirect to="/pulse" /></Route>
        </Switch>
    );
}

function PulseMain() {
    const [, setLocation] = useLocation();
    const [stabilityScore, setStabilityScore] = useState(74);

    useEffect(() => {
        const calcStability = async () => {
            const logs = await getLogs();
            const scores = logs.filter(l => l.type === 'pulse').map(l => l.data.score || 70);
            if (scores.length > 0) {
                const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
                setStabilityScore(Math.round(avg));
            }
        };
        calcStability();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <Header title="Pulse Engine" subtitle="Neural Mapping" />
            <div className="flex-1 screen-container items-center justify-center relative !pt-0">
                <div className="text-center mb-12">
                    <h2 className="font-arabic text-5xl font-bold mb-2">كيف رآسك؟</h2>
                    <span className="text-on-surface-low uppercase tracking-[0.3em] text-[10px] font-black">Tap to Log Frequency</span>
                </div>

                <div className="relative w-72 h-72 flex items-center justify-center mb-12 cursor-pointer group" onClick={() => setLocation("/pulse/tags")}>
                    <div className="absolute inset-0 bg-pulse-cyan/5 rounded-full blur-3xl group-hover:bg-pulse-cyan/10 transition-colors"></div>
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/5" />
                        <motion.circle initial={{ pathLength: 0 }} animate={{ pathLength: stabilityScore / 100 }} transition={{ duration: 1.5, ease: "easeOut" }} cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-pulse-cyan" strokeLinecap="round" strokeDasharray="283" />
                    </svg>
                    <div className="flex flex-col items-center text-center z-10 transition-transform group-active:scale-95">
                        <span className="text-6xl font-display font-black text-pulse-cyan">{stabilityScore}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Stability Index</span>
                    </div>
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                    <button className="glass-panel p-6 flex flex-col items-center gap-3 group transition-standard active-scale hover:bg-pulse-purple/5" onClick={() => setLocation("/pulse/history")}>
                        <Clock className="text-on-surface-low group-hover:text-pulse-purple transition-colors" size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">History</span>
                    </button>
                    <button className="glass-panel p-6 flex flex-col items-center gap-3 group transition-standard active-scale hover:bg-pulse-cyan/5" onClick={() => setLocation("/insights")}>
                        <AreaChart className="text-on-surface-low group-hover:text-pulse-cyan transition-colors" size={20} />
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Insights</span>
                    </button>
                </div>

                {/* Neural Suggestions Section */}
                <NeuralSuggestions />
            </div>
        </div>
    );
}

function NeuralSuggestions() {
    const [, setLocation] = useLocation();
    const [suggestions, setSuggestions] = useState<Recommendation[]>([]);

    useEffect(() => {
        getLocalRecommendations().then(setSuggestions);
    }, []);

    if (suggestions.length === 0) return null;

    return (
        <div className="w-full mt-12 space-y-4">
            <div className="flex items-center gap-2 px-2">
                <Sparkles size={14} className="text-pulse-cyan" />
                <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-700">Neural Suggestions</span>
            </div>
            <div className="space-y-3">
                {suggestions.slice(0, 2).map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setLocation(s.targetPath)}
                        className="w-full p-5 glass-panel border-pulse-cyan/10 flex items-center gap-4 text-left group hover:border-pulse-cyan/30 transition-all active:scale-[0.98]"
                    >
                        <div className={`p-3 rounded-lg ${s.type === 'pulse' ? 'bg-pulse-cyan/10 text-pulse-cyan' : s.type === 'mind' ? 'bg-pulse-pink/10 text-pulse-pink' : 'bg-pulse-purple/10 text-pulse-purple'}`}>
                            <Zap size={18} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-pulse-cyan transition-colors">{s.title}</h4>
                            <p className="text-[10px] text-slate-500 uppercase leading-relaxed mt-1 line-clamp-1">{s.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

function PulseTags({ data, onUpdate }: { data: any, onUpdate: (d: any) => void }) {
    const [, setLocation] = useLocation();

    const toggleTag = (tag: string) => {
        const next = data.tags.includes(tag)
            ? data.tags.filter((t: string) => t !== tag)
            : [...data.tags, tag];
        onUpdate({ tags: next });
    };

    return (
        <div className="screen-container justify-between">
            <div>
                <button onClick={() => setLocation("/pulse")} className="mb-8 text-pulse-cyan active-scale transition-standard"><ChevronLeft /></button>
                <h2 className="text-4xl font-display font-black tracking-tight mb-2 uppercase">Context Mapping</h2>
                <p className="text-on-surface-low font-arabic text-lg mb-8">شنوة اللي مأثر على المورال متاعك اليوم؟</p>
                <div className="flex flex-wrap gap-3">
                    {["Work", "Family", "Health", "Social", "Solitude", "Sleep", "Food", "Exercise"].map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-6 py-3 glass-panel rounded-xl transition-all active:scale-95 font-black uppercase text-[10px] tracking-[0.2em] ${data.tags.includes(tag) ? 'bg-pulse-cyan text-void border-pulse-cyan shadow-[0_0_20px_rgba(0,245,212,0.3)]' : 'border-white/5 hover:border-pulse-cyan/40'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
            <button
                onClick={() => setLocation("/pulse/journal")}
                disabled={data.tags.length === 0}
                className={`w-full py-5 font-bold uppercase tracking-widest transition-all ${data.tags.length > 0 ? 'bg-pulse-cyan text-void' : 'bg-surface-low text-slate-600 opacity-50'}`}
            >
                Next Sequence
            </button>
        </div>
    );
}

function PulseJournal({ data, onUpdate }: { data: any, onUpdate: (d: any) => void }) {
    const [, setLocation] = useLocation();
    return (
        <div className="screen-container">
            <button onClick={() => setLocation("/pulse/tags")} className="mb-8 text-pulse-cyan transition-standard active-scale"><ChevronLeft /></button>
            <h2 className="text-4xl font-display font-black tracking-tight mb-2 uppercase">Internal Note</h2>
            <p className="text-on-surface-low font-arabic text-lg mb-8">احكي مع روحك بشوية... No one else will ever see this.</p>
            <textarea
                value={data.note}
                onChange={(e) => onUpdate({ note: e.target.value })}
                className="flex-1 bg-transparent border-0 text-3xl font-arabic outline-none placeholder:text-on-surface/10 resize-none"
                placeholder="عبر هنا..."
            />
            <button
                onClick={async () => {
                    await saveLog({
                        id: crypto.randomUUID(),
                        type: 'pulse',
                        timestamp: Date.now(),
                        data: {
                            score: 80, // Default for now, can be slider-based
                            tags: data.tags,
                            note: data.note,
                            summary: data.tags.join(", ")
                        }
                    });
                    setLocation("/pulse");
                }}
                className="py-6 bg-pulse-purple text-white font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(155,93,229,0.25)] mt-6 transition-standard active-scale"
            >
                Secure Log Complete
            </button>
        </div>
    );
}

function PulseHistory() {
    const [, setLocation] = useLocation();
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLogs = async () => {
            const logs = await getLogs();
            setHistory(logs.filter(l => l.type === "pulse"));
            setLoading(false);
        };
        loadLogs();
    }, []);

    return (
        <div className="h-full flex flex-col">
            <Header title="Neural Timeline" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation("/pulse")} />
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <EmptyState
                        icon={<Clock size={40} />}
                        title="Zero Trace Found"
                        desc="No neural pulse logs detected in the local vault. Initialize your first check-in."
                        actionLabel="Log Pulse v1.0"
                        onAction={() => setLocation("/pulse")}
                    />
                ) : (
                    <div className="space-y-4">
                        {history.map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 glass-panel flex items-center justify-between group active:scale-[0.98] transition-all"
                                onClick={() => setLocation("/pulse/detail")}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-full border border-pulse-cyan/20 flex items-center justify-center font-display font-black text-pulse-cyan text-xl">
                                        {h.data.score || "74"}
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold uppercase tracking-tight text-on-surface leading-none">{h.data.summary || "Baseline Shift"}</h4>
                                        <div className="mt-1 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(h.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <TrendingUp size={20} className="text-slate-700 group-hover:text-pulse-cyan transition-colors" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function PulseDetail() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full">
            <Header title="Pulse Detail" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation("/pulse/history")} />
            <div className="p-8 space-y-8">
                <div className="text-center p-12 glass-panel rounded-full aspect-square flex flex-col items-center justify-center mx-auto max-w-[280px]">
                    <span className="text-7xl font-display font-black text-pulse-cyan">84</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">April 17 Score</span>
                </div>
                <p className="text-lg leading-relaxed text-slate-400 font-arabic border-l-2 border-pulse-cyan pl-4">
                    Today reminded me that growth isn't linear. I felt a slight tension in the morning but the grounding exercises helped stabilize my neural patterns.
                </p>
                <button onClick={() => setLocation("/pulse/export")} className="w-full py-4 border border-white/10 text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-pulse-cyan transition-colors">Export Memory</button>
            </div>
        </div>
    );
}

function ExportScreen({ onBack }: { onBack: () => void }) {
    return (
        <div className="h-full flex flex-col p-8 justify-center items-center text-center space-y-8">
            <ShieldCheck size={80} className="text-pulse-cyan" />
            <h2 className="text-3xl font-display font-black tracking-tight uppercase">Encryption Vault Export</h2>
            <p className="text-slate-400 leading-relaxed font-arabic">Preparing your psychological data vault in AES-256 encrypted JSON format.</p>
            <div className="w-full h-1 bg-surface-low rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="h-full bg-pulse-cyan" />
            </div>
            <button onClick={onBack} className="text-slate-500 uppercase font-bold tracking-widest text-xs">Return to Sanctuary</button>
        </div>
    );
}
