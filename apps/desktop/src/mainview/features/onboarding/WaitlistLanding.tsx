import { motion } from "framer-motion";
import { ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export function WaitlistLanding() {
    useEffect(() => {
        // Load Tally script for the embed
        const script = document.createElement('script');
        script.src = "https://tally.so/widgets/embed.js";
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-void text-white overflow-hidden relative flex flex-col items-center justify-center p-6 text-center">
            {/* Atmosphere */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-pulse-cyan/10 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[20%] w-96 h-96 bg-pulse-purple/10 blur-[120px] animate-pulse"></div>
                <div className="absolute inset-0 aurora-mesh opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full space-y-12 py-20">
                {/* Brand Identity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="w-24 h-24 glass-panel border-pulse-cyan/20 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(0,245,212,0.15)] p-4">
                        <img src="/logo.png" alt="Nafsi Logo" className="w-full h-full object-contain animate-pulse" />
                    </div>
                    <h1 className="text-7xl font-display font-black tracking-tighter uppercase leading-none">
                        NAFSI v1.0<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pulse-cyan to-pulse-purple">GENESIS</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-arabic leading-relaxed max-w-lg mx-auto">
                        The sanctuary is calibrating. Join the waitlist for the first collective neural sync.
                    </p>
                </motion.div>

                {/* Tally Embed Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="glass-panel p-2 rounded-3xl border-white/5 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] relative bg-void/50 backdrop-blur-xl"
                >
                    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-pulse-cyan/50 to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-pulse-purple/50 to-transparent"></div>

                    <iframe
                        data-tally-src="https://tally.so/embed/b528L6?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
                        loading="lazy"
                        width="100%"
                        height="450"
                        frameBorder="0"
                        title="Nafsi Neural Waitlist"
                        className="bg-transparent opacity-90"
                    ></iframe>
                </motion.div>

                {/* Privacy Assurance */}
                <div className="px-6 py-4 glass-panel border-white/5 rounded-2xl max-w-sm mx-auto">
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-[0.2em] leading-relaxed">
                        Neural Integrity Guaranteed: Your email is stored in a separate encrypted buffer and is never linked to your local sanctuary vault.
                    </p>
                </div>

                {/* Trust Seals */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="flex flex-wrap justify-center gap-8 pt-8"
                >
                    <div className="flex items-center gap-2 text-slate-500 uppercase font-black text-[10px] tracking-widest">
                        <ShieldCheck size={16} className="text-pulse-cyan" />
                        Zero Knowledge
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 uppercase font-black text-[10px] tracking-widest">
                        <Zap size={16} className="text-pulse-purple" />
                        Local First
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 uppercase font-black text-[10px] tracking-widest">
                        <ArrowRight size={16} className="text-pulse-pink" />
                        Anonymous Sync
                    </div>
                </motion.div>
            </div>

            {/* Footer Manifest */}
            <footer className="absolute bottom-10 text-[9px] text-slate-700 uppercase font-bold tracking-[0.4em]">
                NEURAL PROTOCOL 8821-X // EST. 2026
            </footer>
        </div>
    );
}
