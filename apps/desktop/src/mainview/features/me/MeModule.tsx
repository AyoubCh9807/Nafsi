import React from "react";
import {
    Fingerprint,
    Crown,
    LogOut,
    ChevronRight,
    ShieldCheck,
    Globe,
    Bell,
    Palette,
    LifeBuoy,
    Info,
    RefreshCcw,
    ArrowRight
} from "lucide-react";
import { Header } from "../../components/ui/Header";
import { Skeleton } from "../../components/ui/Skeleton";
import { AppState } from "../../types/app";

interface MeProps {
    state: AppState;
    setState: React.Dispatch<React.SetStateAction<AppState>>;
}

import { Switch, Route, useLocation, Redirect } from "wouter";

export function MeModule({ state, setState }: MeProps) {
    return (
        <Switch>
            <Route path="/me"><MeMain state={state} /></Route>
            <Route path="/vault"><MeMain state={state} /></Route>
            <Route path="/me/security"><SettingsDetail title="Security Protocols" onBack={() => window.history.back()} /></Route>
            <Route path="/vault/security"><SettingsDetail title="Security Protocols" onBack={() => window.history.back()} /></Route>
            <Route path="/me/region"><SettingsDetail title="Region & Language" onBack={() => window.history.back()} /></Route>
            <Route path="/vault/region"><SettingsDetail title="Region & Language" onBack={() => window.history.back()} /></Route>
            <Route path="/me/notifications"><SettingsDetail title="Neural Alerts" onBack={() => window.history.back()} /></Route>
            <Route path="/vault/notifications"><SettingsDetail title="Neural Alerts" onBack={() => window.history.back()} /></Route>
            <Route path="/me/appearance"><AppearanceSettings state={state} setState={setState} /></Route>
            <Route path="/vault/appearance"><AppearanceSettings state={state} setState={setState} /></Route>
            <Route path="/me/data_mgmt"><SettingsDetail title="Data Management" onBack={() => window.history.back()} /></Route>
            <Route path="/vault/data_mgmt"><SettingsDetail title="Data Management" onBack={() => window.history.back()} /></Route>
            <Route path="/me/about"><SettingsDetail title="About NAFSI" onBack={() => window.history.back()} /></Route>
            <Route path="/vault/about"><SettingsDetail title="About NAFSI" onBack={() => window.history.back()} /></Route>
            <Route><Redirect to="/me" /></Route>
        </Switch>
    );
}

function MeMain({ state }: { state: AppState }) {
    const [location, setLocation] = useLocation();
    const base = location.startsWith("/vault") ? "/vault" : "/me";

    return (
        <div className="h-full overflow-y-auto pb-32">
            <Header title="Neural Vault" subtitle="IDENTITY & SECURITY" rightIcon={<RefreshCcw size={16} className="m-auto opacity-40" />} />
            <div className="p-8 pt-12 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-8 border-2 border-pulse-cyan/20 p-2 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-pulse-cyan/5 blur-2xl animate-pulse" />
                    <div className="w-full h-full glass-panel rounded-full flex items-center justify-center bg-void">
                        <Fingerprint size={80} className="text-pulse-cyan opacity-40" />
                    </div>
                    <div className="absolute bottom-1 right-1/2 translate-x-1/2 px-2 py-0.5 bg-pulse-cyan text-void text-[8px] font-bold rounded-full uppercase tracking-tighter">SECURE</div>
                </div>
                <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase mb-2">NEURAL_ID: {state.userData.identityId}</h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-surface-low text-[8px] font-bold text-slate-500 uppercase tracking-widest rounded-full">{state.userData.isPremium ? "PREMIUM CORE" : "STANDARD CORE"}</span>
                    <span className="px-3 py-1 bg-surface-low text-[8px] font-bold text-pulse-cyan uppercase tracking-widest rounded-full">ENCRYPTED</span>
                </div>
            </div>

            {!state.userData.isPremium && (
                <div className="px-6 mb-8">
                    <button onClick={() => setLocation("/premium")} className="w-full p-6 rounded-xl bg-gradient-to-r from-pulse-cyan to-pulse-purple flex items-center justify-between group active:scale-[0.98] transition-all">
                        <div className="flex items-center gap-4 text-void">
                            <Crown size={24} className="animate-pulse" />
                            <div className="text-left leading-none">
                                <span className="block text-[10px] font-black uppercase tracking-widest opacity-80">Evolution Required</span>
                                <h3 className="text-xl font-display font-black uppercase">Sanctuary Premium</h3>
                            </div>
                        </div>
                        <ArrowRight className="text-void" />
                    </button>
                </div>
            )}

            <div className="px-6 space-y-4">
                <div className="pt-8 pb-4 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-700">Recent Neural Sessions</span>
                    <button
                        onClick={() => setLocation(`${base}/data_mgmt`)}
                        className="text-[9px] font-bold text-pulse-cyan uppercase tracking-widest border-b border-pulse-cyan/20 pb-0.5 hover:border-pulse-cyan transition-all"
                    >
                        Expand All
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full opacity-60" />
                        <Skeleton className="h-16 w-full opacity-40" />
                    </div>
                    <div className="text-center py-6">
                        <p className="text-[9px] text-slate-700 uppercase font-bold tracking-widest mb-4">No recent cloud-synced sessions. All data is pinned to your local vault.</p>
                        <ShieldCheck className="mx-auto text-slate-800" size={20} />
                    </div>
                </div>

                <div className="pt-8"><span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-700">General Security</span></div>
                <SettingsItem icon={<ShieldCheck size={18} />} title="Security Protocols" desc="Key rotation, Decoy password, Biometrics." onClick={() => setLocation(`${base}/security`)} />
                <SettingsItem icon={<Globe size={18} />} title="Region & Language" desc="Current: العربية / Arabic" onClick={() => setLocation(`${base}/region`)} />
                <SettingsItem icon={<Bell size={18} />} title="Neural Alerts" desc="Configure sanctuary pings and crisis alerts." onClick={() => setLocation(`${base}/notifications`)} />
                <SettingsItem icon={<Palette size={18} />} title="Sanctuary Theme" desc={state.userData.theme === 'dark' ? "Void Mode" : "Lumen Mode"} onClick={() => setLocation(`${base}/appearance`)} />
                <SettingsItem icon={<LifeBuoy size={18} />} title="Data Management" desc="Export vault, Data destruction, Portability." onClick={() => setLocation(`${base}/data_mgmt`)} />
                <SettingsItem icon={<Info size={18} />} title="About NAFSI" desc="Privacy manifesto, License, Terms." onClick={() => setLocation(`${base}/about`)} />
                <button onClick={() => setLocation("/onboarding")} className="w-full p-6 glass-panel border-pulse-pink/10 text-pulse-pink font-bold uppercase tracking-widest text-[10px] flex items-center justify-between group active:scale-[0.98] transition-all">
                    <span>Destroy Session Link</span>
                    <LogOut size={16} className="group-hover:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
}

function AppearanceSettings({ state, setState }: MeProps) {
    const [location, setLocation] = useLocation();
    const base = location.startsWith("/vault") ? "/vault" : "/me";
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
            <Header title="Sanctuary Theme" leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={() => setLocation(base)} />
            <div className="p-8 space-y-6">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 glass-panel rounded-full flex items-center justify-center mx-auto mb-4">
                        <Palette className="text-pulse-cyan" size={32} />
                    </div>
                    <h3 className="text-xl font-display font-black uppercase">Visual Interface</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Select your neural atmosphere</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => setState(p => ({ ...p, userData: { ...p.userData, theme: 'dark' } }))}
                        className={`p-6 rounded-xl border flex items-center justify-between transition-all ${state.userData.theme === 'dark' ? 'bg-pulse-cyan/10 border-pulse-cyan' : 'bg-surface-low border-white/5'}`}
                    >
                        <div className="text-left">
                            <span className="block text-xs font-bold text-white uppercase">Void Mode</span>
                            <span className="text-[10px] text-slate-500 uppercase font-medium">Original dark atmosphere</span>
                        </div>
                        {state.userData.theme === 'dark' && <ShieldCheck size={20} className="text-pulse-cyan" />}
                    </button>

                    <button
                        onClick={() => setState(p => ({ ...p, userData: { ...p.userData, theme: 'light' } }))}
                        className={`p-6 rounded-xl border flex items-center justify-between transition-all ${state.userData.theme === 'light' ? 'bg-pulse-pink/10 border-pulse-pink' : 'bg-surface-low border-white/5'}`}
                    >
                        <div className="text-left">
                            <span className="block text-xs font-bold text-white uppercase">Lumen Mode</span>
                            <span className="text-[10px] text-slate-500 uppercase font-medium">High contrast interface</span>
                        </div>
                        {state.userData.theme === 'light' && <ShieldCheck size={20} className="text-pulse-pink" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SettingsDetail({ title, onBack }: { title: string, onBack: () => void }) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
            <Header title={title} leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={onBack} />
            <div className="p-8 flex flex-col items-center justify-center flex-1 text-center space-y-4">
                <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center animate-pulse">
                    <ShieldCheck className="text-pulse-cyan" size={40} />
                </div>
                <h3 className="text-xl font-display font-black uppercase">{title} Coming Soon</h3>
                <p className="text-sm text-slate-500 font-arabic">سيتم تفعيل هذا الملحق في التحديث القادم.</p>
                <button onClick={onBack} className="text-pulse-cyan font-bold uppercase text-[10px] tracking-widest mt-8">Return to Vault</button>
            </div>
        </div>
    );
}

function SettingsItem({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-6 bg-surface-low rounded-lg border border-white/5 hover:border-pulse-cyan/20 group transition-all active:scale-[0.99]">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-void rounded-lg text-slate-500 group-hover:text-pulse-cyan">{icon}</div>
                <div className="text-left">
                    <h4 className="font-display font-bold text-on-surface uppercase leading-none mb-1">{title}</h4>
                    <p className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">{desc}</p>
                </div>
            </div>
            <ChevronRight size={18} className="text-slate-800 group-hover:text-white transition-colors" />
        </button>
    );
}
