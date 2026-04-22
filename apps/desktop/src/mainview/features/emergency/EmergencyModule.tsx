import React from "react";
import { useLocation } from "wouter";
import {
    X,
    BadgeAlert,
    Phone,
    Stethoscope,
    LifeBuoy,
    MapPin,
    ArrowRight
} from "lucide-react";
import { Header } from "../../components/ui/Header";

interface EmergencyProps { }

export function EmergencyModule({ }: EmergencyProps) {
    const [, setLocation] = useLocation();
    const onBack = () => setLocation("/pulse");

    return (
        <div className="h-full flex flex-col relative bg-[#090505]">
            <div className="absolute inset-0 bg-pulse-pink/5 animate-pulse pointer-events-none" />
            <Header title="CRITICAL MODE" subtitle="Emergency Protocol Active" leftIcon={<X />} onLeftClick={onBack} />
            <div className="flex-1 overflow-y-auto p-8 space-y-8 flex flex-col">
                <div className="text-center space-y-4 mb-8">
                    <BadgeAlert size={80} className="mx-auto text-pulse-pink animate-ping" />
                    <h2 className="text-5xl font-display font-black text-white tracking-tighter uppercase font-arabic leading-none">أنت لست وحدك.</h2>
                    <p className="text-slate-400 font-arabic text-xl leading-relaxed">System has detected high neural distress. Select an immediate protocol.</p>
                </div>

                <div className="space-y-4">
                    <EmergencyAction title="Direct Help: 190" desc="Call immediate medical emergency support." icon={<Phone />} color="bg-pulse-pink" />
                    <EmergencyAction title="Crisis Counselor" desc="Talk to a secure human escalation agent (Anonymously)." icon={<Stethoscope />} color="bg-surface-high" />
                    <EmergencyAction title="Grounding Protocol" desc="Initialize immediate V1 neural stabilization." icon={<LifeBuoy />} color="bg-surface-low" onClick={() => setLocation("/mind/grounding")} />
                    <EmergencyAction title="Safety Plan" desc="Review your pre-constructed escape and safety plan." icon={<MapPin />} color="bg-void border border-pulse-pink/20" />
                </div>
            </div>
            <div className="p-8 text-center"><span className="text-[9px] font-mono font-bold text-pulse-pink/40 uppercase tracking-[0.3em]">NAFSI CRISIS LAYER V4.0 // SECURE LINK ACTIVE</span></div>
        </div>
    );
}

function EmergencyAction({ title, desc, icon, color, onClick }: { title: string, desc: string, icon: React.ReactNode, color: string, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`w-full p-6 ${color} rounded-xl flex items-center justify-between group transition-all active:scale-[0.98] border border-white/5`}>
            <div className="flex items-center gap-6">
                <div className="w-14 h-14 glass-panel flex items-center justify-center text-white">{icon}</div>
                <div className="text-left">
                    <h4 className="text-xl font-display font-black text-white uppercase font-arabic leading-none">{title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">{desc}</p>
                </div>
            </div>
            <ArrowRight className="text-white opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
