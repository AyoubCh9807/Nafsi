import React from "react";
import { Link } from "wouter";

export function NavItem({ active, icon, label, to }: { active: boolean, icon: React.ReactNode, label: string, to: string }) {
    return (
        <Link href={to}>
            <a className={`flex flex-col items-center justify-center transition-standard active-scale ${active ? "text-pulse-cyan" : "text-on-surface-low hover:text-pulse-purple"}`}>
                <div className="relative">{icon}{active && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-pulse-cyan rounded-full shadow-[0_0_12px_#00F5D4]" />}</div>
                <span className="font-arabic text-[11px] uppercase font-black tracking-[0.2em] mt-2 translate-y-1">{label}</span>
            </a>
        </Link>
    );
}
