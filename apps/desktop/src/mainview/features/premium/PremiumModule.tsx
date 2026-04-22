import React from "react";
import {
    Crown,
    X,
    Sparkles,
    ShieldCheck,
    Activity,
    Key,
    CreditCard as PayIcon,
    RotateCcw,
    ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

import { Switch, Route, useLocation } from "wouter";

export function PremiumModule() {
    return (
        <Switch>
            <Route path="/premium" component={PremiumMain} />
            <Route path="/premium/payment" component={PaymentScreen} />
            <Route path="/premium/activating" component={ActivatingScreen} />
        </Switch>
    );
}

function PremiumMain() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full flex flex-col p-8 bg-gradient-to-b from-pulse-purple/10 to-void relative pt-24 overflow-y-auto pb-24">
            <div className="fixed top-8 left-8"><button onClick={() => setLocation("/me")}><X /></button></div>
            <div className="text-center space-y-6 mb-12">
                <Crown size={80} className="mx-auto text-pulse-purple animate-pulse" />
                <h2 className="text-5xl font-display font-black tracking-tight text-white uppercase leading-none">SANCTUARY PREMIUM</h2>
                <p className="text-slate-400 font-arabic text-xl leading-relaxed">Evolve your care with total precision tools and limitless cognitive Link sessions.</p>
            </div>

            <div className="space-y-4 mb-12">
                <PremiumPerk icon={<Sparkles />} text="Infinite AI Session Layers" />
                <PremiumPerk icon={<ShieldCheck />} text="Biometric Lockdown Plus" />
                <PremiumPerk icon={<Activity />} text="Advanced Neural Predictive Analysis" />
                <PremiumPerk icon={<Key />} text="Multiple Identity Layers" />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <button className="glass-panel p-8 rounded-2xl border-pulse-purple/40 bg-surface-high/50 text-center space-y-2 group" onClick={() => setLocation("/premium/payment")}>
                    <span className="text-[10px] font-black uppercase text-pulse-purple tracking-widest">Yearly Commitment</span>
                    <div className="text-4xl font-display font-black text-white">$149.99<span className="text-lg opacity-40">/yr</span></div>
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">Save 40% — Limited Time</span>
                </button>
                <button className="glass-panel p-8 rounded-2xl border-white/5 text-center space-y-2" onClick={() => setLocation("/premium/payment")}>
                    <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Monthly Core</span>
                    <div className="text-4xl font-display font-black text-white">$19.99<span className="text-lg opacity-40">/mo</span></div>
                </button>
            </div>
        </div>
    );
}

function PaymentScreen() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full p-8 flex flex-col pt-24 space-y-8">
            <div className="fixed top-8 left-8"><button onClick={() => setLocation("/premium")}><ChevronLeft /></button></div>
            <h2 className="text-3xl font-display font-black tracking-tight uppercase">SECURE PAYMENT</h2>
            <div className="space-y-6">
                <div className="p-6 glass-panel flex flex-col gap-4">
                    <div className="flex justify-between items-center bg-void p-4 border border-white/5 rounded-lg">
                        <PayIcon className="text-slate-600" />
                        <span className="font-mono text-slate-400">.... .... .... 4421</span>
                    </div>
                    <button
                        className="py-4 bg-pulse-purple text-white font-bold uppercase tracking-widest shadow-lg relative overflow-hidden group"
                        onClick={() => setLocation("/premium/activating")}
                    >
                        <div className="absolute inset-0 shimmer opacity-20 group-hover:opacity-40 transition-opacity" />
                        <span className="relative z-10 transition-transform group-active:scale-95">Finalize Activation</span>
                    </button>
                </div>
                <p className="text-center text-[9px] text-slate-700 uppercase tracking-widest">Encrypted via Stripe Neural Gateway</p>
            </div>
        </div>
    );
}

function ActivatingScreen() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-12">
            <div className="relative">
                <RotateCcw size={80} className="text-pulse-purple animate-spin" />
                <div className="absolute inset-0 blur-3xl bg-pulse-purple/20 animate-pulse" />
            </div>
            <div className="space-y-4">
                <h2 className="text-3xl font-display font-black uppercase tracking-tighter">SECURE ACTIVATION</h2>
                <p className="text-slate-500 font-arabic text-xl leading-relaxed">System is provisioning your Premium Tier Neural Layers. Re-keying encryption vault...</p>
            </div>
            <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4 }}
                    onAnimationComplete={() => setLocation("/me")}
                    className="h-full bg-pulse-purple"
                />
            </div>
            <span className="text-[10px] font-mono text-pulse-purple/60 uppercase tracking-[0.4em]">VAULT_REGEN_01</span>
        </div>
    );
}

function PremiumPerk({ icon, text }: { icon: React.ReactNode, text: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="text-pulse-cyan group-hover:scale-110 transition-transform">{icon}</div>
            <span className="text-sm font-bold text-slate-300 uppercase tracking-tight">{text}</span>
        </div>
    );
}
