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
import { authClient } from "../../lib/auth-client";
import { executeNuclearProtocol } from "../../lib/nuclear";

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
            <Route path="/me/security"><SecuritySettings onBack={() => window.history.back()} /></Route>
            <Route path="/vault/security"><SecuritySettings onBack={() => window.history.back()} /></Route>
            <Route path="/me/region"><RegionSettings onBack={() => window.history.back()} /></Route>
            <Route path="/vault/region"><RegionSettings onBack={() => window.history.back()} /></Route>
            <Route path="/me/notifications"><NotificationSettings onBack={() => window.history.back()} /></Route>
            <Route path="/vault/notifications"><NotificationSettings onBack={() => window.history.back()} /></Route>
            <Route path="/me/appearance"><AppearanceSettings state={state} setState={setState} /></Route>
            <Route path="/vault/appearance"><AppearanceSettings state={state} setState={setState} /></Route>
            <Route path="/me/data_mgmt"><DataManagementSettings onBack={() => window.history.back()} /></Route>
            <Route path="/vault/data_mgmt"><DataManagementSettings onBack={() => window.history.back()} /></Route>
            <Route path="/me/about"><AboutSettings onBack={() => window.history.back()} /></Route>
            <Route path="/vault/about"><AboutSettings onBack={() => window.history.back()} /></Route>
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
                    {!state.isDecoyMode && <div className="absolute bottom-1 right-1/2 translate-x-1/2 px-2 py-0.5 bg-pulse-cyan text-void text-[8px] font-bold rounded-full uppercase tracking-tighter">SECURE</div>}
                </div>
                <h2 className="text-3xl font-display font-black tracking-tight text-white uppercase mb-2">
                    {state.isDecoyMode ? "GUEST_LINK_404" : `NEURAL_ID: ${state.userData.identityId}`}
                </h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-surface-low text-[8px] font-bold text-slate-500 uppercase tracking-widest rounded-full">
                        {state.isDecoyMode ? "EPHEMERAL CORE" : (state.userData.isPremium ? "PREMIUM CORE" : "STANDARD CORE")}
                    </span>
                    <span className="px-3 py-1 bg-surface-low text-[8px] font-bold text-pulse-cyan uppercase tracking-widest rounded-full">
                        {state.isDecoyMode ? "PUBLIC_SYNC" : "ENCRYPTED"}
                    </span>
                </div>
            </div>

            {(!state.userData.isPremium && !state.isDecoyMode) && (
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
                {!state.isDecoyMode && (
                    <>
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
                    </>
                )}

                <div className="pt-8"><span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-700">General Security</span></div>
                {!state.isDecoyMode && <SettingsItem icon={<ShieldCheck size={18} />} title="Security Protocols" desc="Key rotation, Decoy password, Biometrics." onClick={() => setLocation(`${base}/security`)} />}
                <SettingsItem icon={<Globe size={18} />} title="Region & Language" desc="Current: العربية / Arabic" onClick={() => setLocation(`${base}/region`)} />
                <SettingsItem icon={<Bell size={18} />} title="Neural Alerts" desc="Configure sanctuary pings and crisis alerts." onClick={() => setLocation(`${base}/notifications`)} />
                <SettingsItem icon={<Palette size={18} />} title="Sanctuary Theme" desc={state.userData.theme === 'dark' ? "Void Mode" : "Lumen Mode"} onClick={() => setLocation(`${base}/appearance`)} />
                {!state.isDecoyMode && <SettingsItem icon={<LifeBuoy size={18} />} title="Data Management" desc="Export vault, Data destruction, Portability." onClick={() => setLocation(`${base}/data_mgmt`)} />}
                <SettingsItem icon={<Info size={18} />} title="About NAFSI" desc="Privacy manifesto, License, Terms." onClick={() => setLocation(`${base}/about`)} />
                <button
                    onClick={async () => {
                        if (confirm("Are you sure you want to destroy this session link? You will need to re-authenticate to access your vault.")) {
                            await authClient.signOut();
                            setLocation("/login");
                        }
                    }}
                    className="w-full p-6 glass-panel border-pulse-pink/10 text-pulse-pink font-bold uppercase tracking-widest text-[10px] flex items-center justify-between group active:scale-[0.98] transition-all"
                >
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

function SecuritySettings({ onBack }: { onBack: () => void }) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 overflow-y-auto pb-32">
            <Header title="Security" leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={onBack} />
            <div className="p-6 space-y-6">
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-pulse-cyan">Encryption Layer</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white font-bold">Biometric Unlock</p>
                            <p className="text-[10px] text-slate-500 uppercase">Use Fingerprint or FaceID</p>
                        </div>
                        <div className="w-12 h-6 bg-pulse-cyan rounded-full p-1 flex justify-end">
                            <div className="w-4 h-4 bg-void rounded-full" />
                        </div>
                    </div>
                    <div className="flex justify-between items-center opacity-40">
                        <div>
                            <p className="text-white font-bold">Decoy Vault</p>
                            <p className="text-[10px] text-slate-500 uppercase">Secondary distress pin</p>
                        </div>
                        <div className="w-12 h-6 bg-surface-low rounded-full p-1">
                            <div className="w-4 h-4 bg-slate-600 rounded-full" />
                        </div>
                    </div>
                </div>

                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-pulse-purple">Active Sessions</h3>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-xs text-white">This Desktop App</span>
                        <span className="text-[9px] font-bold text-pulse-cyan uppercase">Current</span>
                    </div>
                    <button className="w-full py-3 border border-pulse-pink/20 text-pulse-pink text-[10px] font-black uppercase tracking-widest">Terminate All Others</button>
                </div>

                <button className="w-full p-6 glass-panel flex items-center justify-between group">
                    <div className="text-left">
                        <span className="block text-xs font-bold text-white uppercase">Neural Key Rotation</span>
                        <span className="text-[10px] text-slate-500 uppercase">Regenerate encryption master key</span>
                    </div>
                    <RefreshCcw size={16} className="text-slate-500" />
                </button>
            </div>
        </div>
    );
}

function RegionSettings({ onBack }: { onBack: () => void }) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
            <Header title="Region" leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={onBack} />
            <div className="p-6 space-y-4">
                <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-700 px-2">Primary Dialect</h3>
                {["العربية / Tunisian", "English / US", "Français / France"].map((lang, i) => (
                    <button key={lang} className={`w-full p-6 glass-panel flex items-center justify-between ${i === 0 ? 'border-pulse-cyan bg-pulse-cyan/5' : ''}`}>
                        <span className="text-sm font-bold text-white">{lang}</span>
                        {i === 0 && <ShieldCheck size={18} className="text-pulse-cyan" />}
                    </button>
                ))}
            </div>
        </div>
    );
}

function NotificationSettings({ onBack }: { onBack: () => void }) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
            <Header title="Neural Alerts" leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={onBack} />
            <div className="p-6 space-y-6">
                <div className="glass-panel p-6 space-y-6">
                    <ToggleItem title="Pulse Reminders" desc="Pings for daily neural mapping" active />
                    <ToggleItem title="Crisis Sync" desc="Immediate alerts for detected distress" active />
                    <ToggleItem title="Community Insight" desc="Nexus collective updates" />
                </div>
            </div>
        </div>
    );
}

function DataManagementSettings({ onBack }: { onBack: () => void }) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4">
            <Header title="Vault Control" leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={onBack} />
            <div className="p-6 space-y-4">
                <button className="w-full p-6 glass-panel text-left flex items-center justify-between group hov:bg-white/5">
                    <div>
                        <span className="block text-xs font-bold text-white uppercase">Export Neural History</span>
                        <span className="text-[10px] text-slate-500 uppercase">Download AES-256 JSON</span>
                    </div>
                    <ChevronRight size={18} className="text-slate-800" />
                </button>
                <div className="p-8 border-2 border-pulse-pink/20 bg-pulse-pink/5 rounded-2xl space-y-4">
                    <h3 className="text-lg font-display font-black text-pulse-pink uppercase">Nuclear Protocol</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-relaxed">
                        This will permanently delete all local logs, your identity ID, and all encrypted cloud backups. This cannot be undone.
                    </p>
                    <button
                        onClick={async () => {
                            if (confirm("FINAL WARNING: This is irreversible. All neural logs and sanctuary data will be permanently destroyed. Proceed?")) {
                                await executeNuclearProtocol();
                            }
                        }}
                        className="w-full py-4 bg-pulse-pink text-white font-black uppercase tracking-widest text-xs active:scale-95 transition-all"
                    >
                        Purge All Data
                    </button>
                </div>
            </div>
        </div>
    );
}

function AboutSettings({ onBack }: { onBack: () => void }) {
    return (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 overflow-y-auto pb-24">
            <Header title="Sanctuary Info" leftIcon={<ChevronRight className="rotate-180" />} onLeftClick={onBack} />
            <div className="p-8 text-center space-y-8">
                <div className="w-24 h-24 bg-pulse-cyan/10 rounded-3xl rotate-12 mx-auto flex items-center justify-center border border-pulse-cyan/20">
                    <Fingerprint size={48} className="text-pulse-cyan -rotate-12" />
                </div>
                <div>
                    <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">NAFSI v4.2.0</h2>
                    <p className="text-[10px] text-pulse-cyan font-bold tracking-[0.4em] uppercase mt-2">Neural Awareness & Functional Stability Interface</p>
                </div>
                <div className="space-y-4 text-left">
                    <p className="text-sm text-slate-400 font-arabic leading-relaxed">
                        Nafsi represents a new paradigm in digital mental health. By combining local-first encryption with neural mapping, we provide a sovereign sanctuary for your mind.
                    </p>
                    <div className="h-px bg-white/5" />
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>Legal Manifesto</span>
                        <ChevronRight size={14} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                        <span>Privacy Protocol</span>
                        <ChevronRight size={14} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ToggleItem({ title, desc, active = false }: { title: string, desc: string, active?: boolean }) {
    return (
        <div className="flex justify-between items-center">
            <div className="text-left">
                <p className="text-white font-bold text-sm uppercase">{title}</p>
                <p className="text-[10px] text-slate-500 uppercase">{desc}</p>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 flex transition-colors ${active ? 'bg-pulse-cyan justify-end' : 'bg-surface-low justify-start'}`}>
                <div className="w-4 h-4 bg-void rounded-full shadow-sm" />
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
