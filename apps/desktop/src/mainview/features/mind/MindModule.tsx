import React from "react";
import {
    BookOpen,
    Wind,
    Navigation,
    Activity,
    ChevronLeft,
    ArrowRight,
    X,
    RefreshCcw
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../../components/ui/Header";

import { Switch, Route, useLocation } from "wouter";

export function MindModule() {
    return (
        <Switch>
            <Route path="/mind" component={MindMain} />
            <Route path="/mind/cbt_library" component={CBTLibrary} />
            <Route path="/mind/cbt_player" component={CBTPlayer} />
            <Route path="/mind/breathing" component={BreathingSession} />
            <Route path="/mind/grounding" component={GroundingProtocol} />
            <Route path="/mind/progress" component={ProgressData} />
        </Switch>
    );
}

function MindMain() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full overflow-y-auto pb-32">
            <Header title="Mind Protocols" subtitle="Neural Restoration" />
            <div className="p-6 space-y-8">
                <div className="relative group grayscale hover:grayscale-0 transition-all duration-1000">
                    <div className="absolute -inset-1 bg-gradient-to-r from-pulse-cyan to-pulse-purple rounded-xl blur opacity-20 group-hover:opacity-40" />
                    <div className="relative glass-panel rounded-xl p-8 overflow-hidden aspect-[16/10] flex flex-col justify-end">
                        <img src="https://picsum.photos/seed/void/800/600" className="absolute inset-0 w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
                        <div className="relative z-10">
                            <span className="text-pulse-cyan text-[10px] font-bold uppercase tracking-widest mb-2 block">Protocol 01</span>
                            <h2 className="text-4xl font-display font-black mb-4 tracking-tighter">VOID MEDITATION</h2>
                            <button onClick={() => setLocation("/mind/breathing")} className="bg-pulse-cyan text-void px-8 py-3 rounded-md font-bold uppercase text-[10px] tracking-widest">Initialize</button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <MindActionCard icon={<BookOpen size={24} />} title="CBT Core" onClick={() => setLocation("/mind/cbt_library")} />
                    <MindActionCard icon={<Wind size={24} />} title="Breathwork" onClick={() => setLocation("/mind/breathing")} />
                    <MindActionCard icon={<Navigation size={24} />} title="5-4-3-2-1" onClick={() => setLocation("/mind/grounding")} />
                    <MindActionCard icon={<Activity size={24} />} title="Progress" onClick={() => setLocation("/mind/progress")} />
                </div>
            </div>
        </div>
    );
}

function CBTLibrary() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full overflow-y-auto pb-32">
            <Header title="CBT Library" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation("/mind")} />
            <div className="p-6 space-y-4">
                {["Cognitive Distortions", "Thought Records", "Behavioral Activation", "Core Beliefs Shift", "Exposure Protocol"].map(t => (
                    <div key={t} className="glass-panel p-6 flex justify-between items-center group hover:border-pulse-purple/30 cursor-pointer" onClick={() => setLocation("/mind/cbt_player")}>
                        <span className="font-display font-bold text-lg">{t}</span>
                        <ArrowRight className="text-slate-600 group-hover:text-pulse-purple" />
                    </div>
                ))}
            </div>
        </div>
    );
}

function CBTPlayer() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full p-8 flex flex-col justify-between items-center">
            <div className="w-full flex justify-between"><button onClick={() => setLocation("/mind/cbt_library")}><X /></button><RefreshCcw size={20} className="text-slate-700" /></div>
            <div className="text-center space-y-6">
                <h2 className="text-[10px] uppercase tracking-widest text-pulse-purple font-bold">CBT Sequence Active</h2>
                <h1 className="text-5xl font-display font-black tracking-tight leading-none uppercase">Identifying Distortions</h1>
                <p className="text-slate-500 font-arabic text-xl leading-relaxed">
                    What is the evidence that your catastrophic thought is actually true? Write down 3 cold, hard facts.
                </p>
            </div>
            <button className="w-full py-5 glass-panel text-pulse-purple font-bold uppercase tracking-widest border-pulse-purple/30">Complete Section</button>
        </div>
    );
}

function BreathingSession() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-[#050508]">
            <div className="fixed top-8 left-8"><button onClick={() => setLocation("/mind")}><X /></button></div>
            <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="w-48 h-48 rounded-full bg-pulse-cyan blur-3xl"
            />
            <div className="text-center space-y-4 absolute">
                <span className="text-6xl font-display font-black text-white tracking-widest">BREATHE</span>
                <span className="block text-[10px] text-pulse-cyan font-bold tracking-[0.5em] uppercase">Inhale — 4 Seconds</span>
            </div>
            <div className="fixed bottom-12 w-full px-8 text-center"><span className="text-slate-600 uppercase tracking-widest font-bold text-[10px]">Session V01 // Stable Neural Connection</span></div>
        </div>
    );
}

function GroundingProtocol() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full p-8 flex flex-col justify-between">
            <Header title="5-4-3-2-1" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation("/mind")} />
            <div className="flex-1 flex flex-col justify-center space-y-12">
                <GroundingStep num="5" label="Things you can SEE" />
                <GroundingStep num="4" label="Things you can TOUCH" opacity={0.6} />
                <GroundingStep num="3" label="Things you can HEAR" opacity={0.3} />
            </div>
            <button onClick={() => setLocation("/mind")} className="w-full py-5 bg-pulse-cyan text-void font-bold uppercase tracking-widest">Protocol Complete</button>
        </div>
    );
}

function ProgressData() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full">
            <Header title="Exercise Data" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation("/mind")} />
            <div className="p-8 space-y-8 text-center">
                <Activity size={60} className="mx-auto text-pulse-purple" />
                <h2 className="text-3xl font-display font-black tracking-tight uppercase">Neural Reprogramming Check</h2>
                <div className="text-[120px] font-display font-black text-pulse-purple leading-none tracking-tighter">88%</div>
                <p className="text-slate-500 font-arabic text-lg leading-relaxed">Your consistency in CBT exercises has increased your baseline neuro-stability by 12% this week.</p>
            </div>
        </div>
    );
}

function GroundingStep({ num, label, opacity = 1 }: { num: string, label: string, opacity?: number }) {
    return (
        <div className="flex items-center gap-8" style={{ opacity }}>
            <div className="text-8xl font-display font-black text-pulse-cyan">{num}</div>
            <div className="uppercase tracking-widest font-bold text-xs text-slate-400">{label}</div>
        </div>
    );
}

function MindActionCard({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="glass-panel p-6 flex flex-col items-center gap-4 transition-all hover:bg-surface-highest group">
            <div className="p-4 bg-white/5 rounded-lg text-slate-500 group-hover:text-pulse-cyan">{icon}</div>
            <span className="font-bold text-[10px] uppercase tracking-widest">{title}</span>
        </button>
    );
}
