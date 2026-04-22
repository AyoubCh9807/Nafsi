import React from "react";
import {
    Globe,
    Calendar,
    ScanFace,
    Fingerprint,
    VenetianMask,
    Cpu,
    Sparkles,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { AppState } from "../../types/app";
import { Switch, Route, useLocation } from "wouter";

interface OnboardingProps {
    setState: React.Dispatch<React.SetStateAction<AppState>>;
}
export function OnboardingFlow({ setState }: OnboardingProps) {
    return (
        <Switch>
            <Route path="/onboarding" component={SplashView} />
            <Route path="/onboarding/language" component={LanguageSetup} />
            <Route path="/onboarding/age" component={AgeVerification} />
            <Route path="/onboarding/identity" component={IdentityAssignment} />
            <Route path="/onboarding/biometric" component={BiometricSetup} />
            <Route path="/onboarding/decoy" component={DecoyProtocol} />
            <Route path="/onboarding/keygen" component={EncryptionKeygen} />
            <Route path="/onboarding/complete">
                <CompletionStep setState={setState} />
            </Route>
        </Switch>
    );
}

function SplashView() {
    const [, setLocation] = useLocation();
    return (
        <div className="h-full flex flex-col items-center justify-center px-8 text-center aurora-mesh" onClick={() => setLocation("/onboarding/language")}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8">
                <h1 className="text-8xl md:text-[120px] font-black font-display tracking-tighter text-pulse-cyan neon-glow-cyan">نفسي</h1>
                <h2 className="text-xl font-bold tracking-[0.5em] text-white/20 -mt-2">NAFSI</h2>
            </motion.div>
            <p className="text-slate-400 font-arabic text-lg max-w-xs animate-pulse">Touch the void to begin.</p>
        </div>
    );
}

function LanguageSetup() {
    const [, setLocation] = useLocation();
    return (
        <OnboardingStep
            icon={<Globe size={40} className="text-pulse-cyan" />}
            title="Language & Region"
            desc="Select your sanctuary language. Native Arabic support available by default."
            onNext={() => setLocation("/onboarding/age")}
        >
            <div className="grid grid-cols-2 gap-4 w-full">
                <button className="p-6 glass-panel border-pulse-cyan/40 text-pulse-cyan font-bold active:scale-95 transition-transform">العربية</button>
                <button className="p-6 glass-panel opacity-40 hover:opacity-100 transition-opacity">English</button>
                <button className="p-6 glass-panel opacity-40 hover:opacity-100 transition-opacity">Français</button>
                <button className="p-6 glass-panel opacity-40 hover:opacity-100 transition-opacity">Other</button>
            </div>
        </OnboardingStep>
    );
}

function AgeVerification() {
    const [, setLocation] = useLocation();
    return (
        <OnboardingStep
            icon={<Calendar size={40} className="text-pulse-purple" />}
            title="Age Verification"
            desc="This sanctuary is for adults. Please verify you are above 18 to proceed with high-precision care."
            onNext={() => setLocation("/onboarding/identity")}
        >
            <div className="flex flex-col items-center gap-6 w-full">
                <div className="text-6xl font-display font-black text-white">1998</div>
                <input type="range" className="w-full accent-pulse-purple" min="1940" max="2008" />
            </div>
        </OnboardingStep>
    );
}

function IdentityAssignment() {
    const [, setLocation] = useLocation();
    return (
        <OnboardingStep
            icon={<ScanFace size={40} className="text-pulse-pink" />}
            title="Anonymous Identity"
            desc="Your data is linked to a private key, not your identity. Here is your generated NeuroID."
            onNext={() => setLocation("/onboarding/biometric")}
        >
            <div className="p-8 glass-panel w-full text-center border-dashed border-pulse-pink/30">
                <span className="text-xs font-mono text-slate-500 uppercase block mb-2">System Generated ID</span>
                <span className="text-3xl font-display font-black text-pulse-pink tracking-widest">NEURAL_ID: 8821-X</span>
            </div>
        </OnboardingStep>
    );
}

function BiometricSetup() {
    const [, setLocation] = useLocation();
    return (
        <OnboardingStep
            icon={<Fingerprint size={40} className="text-pulse-cyan" />}
            title="Biometric Setup"
            desc="Enable FaceID or TouchID for rapid, secure access to your sanctuary."
            onNext={() => setLocation("/onboarding/decoy")}
        >
            <button className="p-10 rounded-full glass-panel border-pulse-cyan/20 animate-pulse"><Fingerprint size={60} className="text-pulse-cyan" /></button>
        </OnboardingStep>
    );
}

function DecoyProtocol() {
    const [, setLocation] = useLocation();
    return (
        <OnboardingStep
            icon={<VenetianMask size={40} className="text-pulse-purple" />}
            title="Decoy Protocol"
            desc="Set a secondary password that opens a clean, decoy version of the app if forced to open it."
            onNext={() => setLocation("/onboarding/keygen")}
        >
            <div className="flex gap-4"><div className="w-12 h-12 glass-panel" /><div className="w-12 h-12 glass-panel" /><div className="w-12 h-12 glass-panel" /><div className="w-12 h-12 glass-panel" /></div>
        </OnboardingStep>
    );
}

function EncryptionKeygen() {
    const [, setLocation] = useLocation();
    return (
        <OnboardingStep
            icon={<Cpu size={40} className="text-pulse-cyan" />}
            title="Encryption Core"
            desc="Generating your local AES-256-GCM vault. This key never leaves your device."
            onNext={() => setLocation("/onboarding/complete")}
        >
            <div className="w-full h-2 bg-surface-low rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-pulse-cyan" />
            </div>
        </OnboardingStep>
    );
}

function CompletionStep({ setState }: { setState: React.Dispatch<React.SetStateAction<AppState>> }) {
    const [, setLocation] = useLocation();
    const finish = () => {
        setState(p => ({ ...p, hasOnboarded: true }));
        setLocation("/pulse");
    };
    return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8">
            <Sparkles size={80} className="text-pulse-cyan animate-bounce" />
            <h1 className="text-4xl font-display font-black tracking-tight">Sanctuary Ready.</h1>
            <p className="text-slate-400 font-arabic">قلبُكَ الآن في مأمن. اضغط للدخول في جلستك الأولى.</p>
            <button onClick={finish} className="w-full py-6 bg-pulse-cyan text-void font-bold text-xl uppercase tracking-widest">Begin First Session</button>
        </div>
    );
}

function OnboardingStep({ icon, title, desc, children, onNext }: { icon: React.ReactNode, title: string, desc: string, children: React.ReactNode, onNext: () => void }) {
    return (
        <div className="h-full flex flex-col p-8 pt-24 justify-between">
            <div className="space-y-6">
                <div className="w-16 h-16 rounded-xl glass-panel flex items-center justify-center">{icon}</div>
                <h2 className="text-4xl font-display font-black tracking-tight leading-none">{title}</h2>
                <p className="text-slate-400 leading-relaxed font-arabic text-lg">{desc}</p>
                <div className="py-8">{children}</div>
            </div>
            <button onClick={onNext} className="w-full py-5 bg-surface-highest text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 border border-white/5">
                Continue
                <ArrowRight size={20} />
            </button>
        </div>
    );
}
