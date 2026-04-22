import React from "react";

export function EmptyState({ icon, title, desc, actionLabel, onAction }: { icon: React.ReactNode, title: string, desc: string, actionLabel?: string, onAction?: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-20 h-20 glass-panel rounded-full flex items-center justify-center text-slate-700 mb-2">
                {icon}
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500 font-arabic leading-relaxed max-w-[240px]">{desc}</p>
            </div>
            {actionLabel && (
                <button onClick={onAction} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-pulse-cyan hover:bg-pulse-cyan hover:text-void transition-all">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
