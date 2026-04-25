import React from "react";
import {
    Sparkles,
    ArrowRight,
    X,
    Activity,
    Layers,
    Share2
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from "recharts";
import { Header } from "../../components/ui/Header";

import { aggregateNeuralData, getTopDistortions, getWellnessMetrics, ChartPoint } from "./data-aggregator";

import { Switch, Route, useLocation } from "wouter";

export function InsightsModule() {
    return (
        <Switch>
            <Route path="/insights" component={InsightsMain} />
            <Route path="/insights/ai_insights" component={AIInsights} />
            <Route path="/insights/dashboard" component={InsightsMain} />
            <Route path="/insights/trends" component={InsightsMain} />
        </Switch>
    );
}

function InsightsMain() {
    const [, setLocation] = useLocation();
    const [precisionData, setPrecisionData] = React.useState<ChartPoint[]>([]);
    const [metrics, setMetrics] = React.useState({ offset: "0.0", sync: 0 });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const load = async () => {
            const data = await aggregateNeuralData();
            const m = await getWellnessMetrics();
            setPrecisionData(data);
            setMetrics(m as any);
            setLoading(false);
        };
        load();
    }, []);

    const collectiveData = [
        { name: "00:00", active: 120 },
        { name: "04:00", active: 450 },
        { name: "08:00", active: 890 },
        { name: "12:00", active: 1240 },
        { name: "16:00", active: 1560 },
        { name: "20:00", active: 2100 },
    ];
    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-void">
                <div className="w-12 h-12 border-2 border-pulse-cyan/20 border-t-pulse-cyan rounded-full animate-spin" />
                <span className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Synthesizing Neural Data...</span>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto pb-32">
            <Header title="Data Engine" subtitle="Neural Insights" />
            <div className="p-6 space-y-8">
                {/* Main Chart Section */}
                <section className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-black uppercase tracking-tight leading-none text-on-surface">Neural Precision</h3>
                            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">7-Day Synthesis Loop</p>
                        </div>
                        <span className="text-[10px] font-bold text-pulse-cyan bg-pulse-cyan/10 px-2 py-1 rounded">REFINING...</span>
                    </div>
                    <div className="glass-panel p-6 h-[300px] relative overflow-hidden">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={precisionData}>
                                <defs>
                                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#475569", fontSize: 10, fontWeight: "bold" }}
                                    dy={10}
                                />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                                    itemStyle={{ color: "#00F5D4", fontWeight: "bold" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="score"
                                    stroke="#00F5D4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#cyanGradient)"
                                    animationDuration={2000}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                    <InsightGridItem
                        icon={<Activity size={16} className="text-pulse-cyan" />}
                        title="Wellness Offset"
                        value={metrics.offset}
                        meta={parseFloat(metrics.offset) >= 0 ? `+${metrics.offset}%` : `${metrics.offset}%`}
                        onClick={() => setLocation("/insights/dashboard")}
                    />
                    <InsightGridItem
                        icon={<Layers size={16} className="text-pulse-purple" />}
                        title="Neural Sync"
                        value={`${metrics.sync}%`}
                        meta={metrics.sync > 80 ? "OPTIMAL" : "STABILIZING"}
                        onClick={() => setLocation("/insights/trends")}
                    />
                </div>

                {/* Collective Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Share2 size={16} className="text-slate-500" />
                        <h3 className="text-xs font-display font-black uppercase tracking-widest text-slate-500">Collective Sanctuary Gravity</h3>
                    </div>
                    <div className="glass-panel p-6 h-[200px] relative">
                        {/* Abstract background for bar chart */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-pulse-purple to-transparent" />
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={collectiveData}>
                                <Bar dataKey="active" radius={[4, 4, 0, 0]}>
                                    {collectiveData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#9B5DE5" : "#F15BB5"} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#475569", fontSize: 10, fontWeight: "bold" }}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                                    contentStyle={{ backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <div className="glass-panel p-6 border-pulse-purple/30 group cursor-pointer active:scale-[0.99] transition-transform" onClick={() => setLocation("/insights/ai_insights")}>
                    <div className="flex items-center gap-4 mb-4">
                        <Sparkles className="text-pulse-purple" size={20} />
                        <h4 className="font-display font-black uppercase tracking-tight text-pulse-purple underline-offset-4 underline decoration-pulse-purple/20">AI Synthesis Ready</h4>
                    </div>
                    <p className="text-sm text-slate-400 font-arabic leading-relaxed mb-4">
                        Your neural patterns show a strong correlation between social interactions and evening stress levels. Recommendation: Deep Breath Protocol at 6 PM.
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600">PROTOCOL_ID: 882-SYN</span>
                        <ArrowRight className="text-pulse-purple group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function AIInsights() {
    const [, setLocation] = useLocation();
    const [distortionData, setDistortionData] = React.useState<any[]>([]);

    React.useEffect(() => {
        const load = async () => {
            const data = await getTopDistortions();
            setDistortionData(data);
        };
        load();
    }, []);
    return (
        <div className="h-full flex flex-col bg-void">
            <Header title="AI Engine" subtitle="Neural Synthesis" leftIcon={<X />} onLeftClick={() => setLocation("/insights")} />

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
                <section className="flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-pulse-purple blur-3xl opacity-20 animate-pulse"></div>
                        <Sparkles size={64} className="text-pulse-purple relative z-10" />
                    </div>
                    <h2 className="text-4xl font-display font-black tracking-tighter uppercase leading-none">Cognitive<br />Distortions</h2>
                    <p className="text-slate-500 max-w-xs text-sm font-bold uppercase tracking-widest">Gravity Analysis of Thought Loops</p>
                </section>

                <div className="glass-panel p-8 h-[350px] flex flex-col items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={distortionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={10}
                                dataKey="value"
                                stroke="none"
                                animationBegin={0}
                                animationDuration={1500}
                            >
                                {distortionData.map((d, index) => (
                                    <Cell key={`cell-${index}`} fill={d.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                itemStyle={{ fontWeight: "black", textTransform: "uppercase", fontSize: "10px" }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="block text-[10px] font-black text-slate-500 tracking-widest uppercase">Gravity</span>
                            <span className="text-3xl font-display font-black text-white">4.2</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-12">
                    {distortionData.map((d) => (
                        <div key={d.name} className="glass-panel p-4 flex flex-col gap-2 border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{d.name}</span>
                            </div>
                            <div className="text-xl font-display font-black text-white">{d.value}%</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6 pb-24">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-700 px-1">Detected Divergence Points</h3>
                    <InsightPoint title="Cortisol Loop" desc="We detected a recurring peak at 11:30 AM. This aligns with your work schedule. Your heart rate variability dropped by 18%." />
                    <InsightPoint title="Growth Gradient" desc="Despite stress peaks, your emotional regulation exercises are 24% more effective than last month." />
                    <InsightPoint title="Recommended Shift" desc="Redirect focus to Cognitive Distortions during morning peaks to achieve 90% stability." />
                </div>
            </div>
        </div>
    );
}

function InsightPoint({ title, desc }: { title: string, desc: string }) {
    return (
        <div className="space-y-2 border-l-2 border-pulse-purple/30 pl-6 py-2">
            <h4 className="font-display font-bold uppercase tracking-widest text-pulse-purple text-xs">{title}</h4>
            <p className="text-slate-400 font-arabic text-lg leading-relaxed">{desc}</p>
        </div>
    );
}

function InsightGridItem({ title, value, meta, onClick, icon }: { title: string, value: string, meta: string, onClick: () => void, icon: React.ReactNode }) {
    return (
        <button onClick={onClick} className="glass-panel p-6 text-left hover:border-white/20 transition-all active:scale-95 group">
            <div className="flex items-center gap-2 mb-2 opacity-40 group-hover:opacity-100 transition-opacity">
                {icon}
                <span className="text-[9px] uppercase tracking-widest text-slate-500 font-black">{title}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-black text-white">{value}</span>
                <span className="text-[10px] font-bold text-pulse-cyan">{meta}</span>
            </div>
        </button>
    );
}
