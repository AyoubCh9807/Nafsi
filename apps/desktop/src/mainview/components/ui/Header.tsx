import React from "react";
import { Menu } from "lucide-react";

export function Header({ title, leftIcon, onLeftClick, rightIcon, onRightClick, subtitle }: { title: string, leftIcon?: React.ReactNode, onLeftClick?: () => void, rightIcon?: React.ReactNode, onRightClick?: () => void, subtitle?: string }) {
    return (
        <header className="bg-void/60 backdrop-blur-2xl shrink-0 z-50 border-b border-white/10 flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
                {leftIcon ? <button onClick={onLeftClick} className="text-pulse-cyan">{leftIcon}</button> : <Menu className="text-pulse-cyan opacity-40" />}
                <div className="flex flex-col">
                    <h1 className="text-lg font-black tracking-tighter text-pulse-cyan font-display uppercase">{title}</h1>
                    {subtitle && <span className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">{subtitle}</span>}
                </div>
            </div>
            {rightIcon && <button onClick={onRightClick} className="w-8 h-8 rounded-full overflow-hidden border border-white/10">{rightIcon}</button>}
        </header>
    );
}
