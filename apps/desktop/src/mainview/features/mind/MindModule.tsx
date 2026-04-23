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
    const [step, setStep] = React.useState(0);
    const steps = [
        { q: "What is the evidence that your catastrophic thought is actually true?", sub: "Write down 3 cold, hard facts." },
        { q: "What is the evidence AGAINST this thought?", sub: "Look for alternative explanations." },
        { q: "What would you tell a friend in this exact situation?", sub: "Be as compassionate as you would be to them." }
    ];

    const next = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else setLocation("/mind/progress");
    };

    return (
        <div className="h-full p-8 flex flex-col justify-between items-center bg-[#050510]">
            <div className="w-full flex justify-between"><button onClick={() => setLocation("/mind/cbt_library")}><X /></button><RefreshCcw size={20} className="text-slate-700" /></div>
            <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                <h2 className="text-[10px] uppercase tracking-widest text-pulse-purple font-bold">CBT Sequence Active // STEP {step + 1}</h2>
                <h1 className="text-4xl font-display font-black tracking-tight leading-none uppercase">{steps[step].q}</h1>
                <p className="text-slate-500 font-arabic text-xl leading-relaxed">
                    {steps[step].sub}
                </p>
                <textarea className="w-full bg-surface-low/30 border border-white/5 rounded-xl p-6 text-xl font-arabic text-white focus:outline-none focus:border-pulse-purple h-40 resize-none transition-all" placeholder="عبر هنا..." />
            </motion.div>
            <button onClick={next} className="w-full py-5 glass-panel text-pulse-purple font-black uppercase tracking-widest border-pulse-purple/30 active:scale-95 transition-all">
                {step < steps.length - 1 ? "Advance Sync" : "Anchor Session"}
            </button>
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
    const [step, setStep] = React.useState(5);

    const steps = [
        { n: 5, l: "Things you can SEE" },
        { n: 4, l: "Things you can TOUCH" },
        { n: 3, l: "Things you can HEAR" },
        { n: 2, l: "Things you can SMELL" },
        { n: 1, l: "Thing you can TASTE" },
    ];

    return (
        <div className="h-full p-8 flex flex-col justify-between bg-void">
            <Header title="5-4-3-2-1" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation("/mind")} />
            <div className="flex-1 flex flex-col justify-center gap-10">
                {steps.map((s) => (
                    <div key={s.n} className={`flex items-center gap-8 transition-all duration-700 ${step < s.n ? 'opacity-20 translate-x-4 grayscale' : 'opacity-100 translate-x-0'}`}>
                        <div className="text-7xl font-display font-black text-pulse-cyan">{s.n}</div>
                        <div className="uppercase tracking-widest font-bold text-xs text-slate-400">{s.l}</div>
                    </div>
                ))}
            </div>
            <button
                onClick={() => {
                    if (step > 1) setStep(step - 1);
                    else setLocation("/mind");
                }}
                className="w-full py-6 bg-pulse-cyan text-void font-black uppercase tracking-widest shadow-[0_0_40px_rgba(0,245,212,0.3)] transition-all active:scale-95"
            >
                {step > 1 ? `Detected Step ${step}` : "Protocol Synchronized"}
            </button>
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



function MindActionCard({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="glass-panel p-6 flex flex-col items-center gap-4 transition-all hover:bg-surface-highest group">
            <div className="p-4 bg-white/5 rounded-lg text-slate-500 group-hover:text-pulse-cyan">{icon}</div>
            <span className="font-bold text-[10px] uppercase tracking-widest">{title}</span>
        </button>
    );
}
