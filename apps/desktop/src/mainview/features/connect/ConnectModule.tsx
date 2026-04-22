import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  Send
} from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../../components/ui/Header";
import { Skeleton } from "../../components/ui/Skeleton";

import { Switch, Route, useLocation, Redirect } from "wouter";

export function ConnectModule() {
  return (
    <Switch>
      <Route path="/connect" component={ConnectMain} />
      <Route path="/nexus" component={ConnectMain} />
      <Route path="/connect/room" component={ConnectRoom} />
      <Route path="/nexus/room" component={ConnectRoom} />
      <Route path="/connect/create" component={ConnectCreate} />
      <Route path="/nexus/create" component={ConnectCreate} />
      <Route><Redirect to="/nexus" /></Route>
    </Switch>
  );
}

function ConnectMain() {
  const [location, setLocation] = useLocation();
  const base = location.startsWith("/nexus") ? "/nexus" : "/connect";
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConnecting(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full overflow-y-auto pb-32">
      <Header title="The Nexus" subtitle="Anonymous Collective" />
      <div className="p-6 space-y-8">
        <section>
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-700 mb-4 px-2">Live Sanctuary Rooms</h3>
          <div className="grid grid-cols-1 gap-4">
            {connecting ? (
              [...Array(3)].map((_, i) => (
                <React.Fragment key={i}>
                  <Skeleton className="h-28 w-full" />
                </React.Fragment>
              ))
            ) : (
              <>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <RoomCard title="Tech Burnout" active={12} type="Work" color="text-pulse-cyan" onClick={() => setLocation(`${base}/room`)} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <RoomCard title="Mindful Silence" active={45} type="Growth" color="text-pulse-purple" onClick={() => setLocation(`${base}/room`)} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <RoomCard title="Crisis Sync" active={3} type="Safety" color="text-pulse-pink" onClick={() => setLocation(`${base}/room`)} />
                </motion.div>
              </>
            )}
          </div>
        </section>

        <button onClick={() => setLocation(`${base}/create`)} className="w-full py-5 glass-panel flex items-center justify-center gap-3 border-dashed border-white/10 group hover:border-pulse-cyan/40">
          <Plus className="text-slate-600 group-hover:text-pulse-cyan" />
          <span className="font-bold text-xs uppercase tracking-widest">Construct New Space</span>
        </button>
      </div>
    </div>
  );
}

function ConnectRoom() {
  const [location, setLocation] = useLocation();
  const base = location.startsWith("/nexus") ? "/nexus" : "/connect";
  return (
    <div className="h-full flex flex-col relative bg-[#050508]">
      <Header title="ANONYMOUS_VOID" subtitle="12 PEERS SYNCED" leftIcon={<ChevronLeft />} onLeftClick={() => setLocation(base)} />
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="text-center py-8"><span className="text-[9px] uppercase tracking-widest text-slate-800 font-bold bg-white/5 py-1 px-4 rounded-full">Encrypted P2P Nexus Protocol Active</span></div>
        <RoomMessage user="GHOST_44" text="Today was the hardest day in a while, but I'm trying to stay present." />
        <RoomMessage user="VOID_USER" text="We see you. Remember the 5-4-3-2-1 protocol if the tension peaks." />
        <RoomMessage user="PULSE_88" text="Is anyone else finding the evening sessions helpful?" isOwn />
      </div>
      <div className="p-6 pb-24 flex items-center gap-4">
        <input className="flex-1 bg-surface-low border-b border-white/5 px-0 py-4 font-arabic text-on-surface focus:outline-none focus:border-pulse-cyan" placeholder="Transmit thought..." />
        <button className="p-3 bg-pulse-cyan text-void rounded-lg"><Send size={20} /></button>
      </div>
    </div>
  );
}

function ConnectCreate() {
  const [location, setLocation] = useLocation();
  const base = location.startsWith("/nexus") ? "/nexus" : "/connect";
  return <div className="p-8">Create Room Component... <button onClick={() => setLocation(base)}>Back</button></div>;
}

function RoomMessage({ user, text, isOwn }: { user: string, text: string, isOwn?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 max-w-[80%] ${isOwn ? 'ml-auto items-end' : 'items-start'}`}>
      <span className="text-[10px] font-mono tracking-widest text-slate-700 font-bold uppercase">{user}</span>
      <div className={`p-4 rounded-xl border border-white/5 ${isOwn ? 'bg-pulse-cyan text-void font-bold shadow-[0_0_15px_rgba(0,245,212,0.2)]' : 'glass-panel text-slate-300'}`}>
        <p className="text-sm font-arabic leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function RoomCard({
  title,
  active,
  type,
  color,
  onClick
}: {
  title: string;
  active: number;
  type: string;
  color: string;
  onClick: () => void;
}) {
  const displayCount = Math.min(active, 3);
  const overflow = active - displayCount;

  return (
    <button
      onClick={onClick}
      className="glass-panel p-6 flex items-center justify-between group hover:bg-surface-high transition-all border-white/5 w-full text-left"
    >
      <div className="space-y-1">
        <span className={`text-[10px] uppercase font-black tracking-widest ${color}`}>
          {type}
        </span>
        <h4 className="text-2xl font-display font-black text-on-surface tracking-tighter uppercase">
          {title}
        </h4>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex -space-x-1.5">
          {active === 0 ? (
            <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-700" />
          ) : (
            <>
              {[...Array(displayCount)].map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full bg-slate-800 border-2 border-void group-hover:bg-slate-700 transition-colors"
                />
              ))}
              {overflow > 0 && (
                <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-void flex items-center justify-center">
                  <span className="text-[8px] font-bold text-slate-400">+{overflow}</span>
                </div>
              )}
            </>
          )}
        </div>

        <span className={`
          text-[9px] font-bold uppercase tracking-widest
          ${active > 0 ? 'text-slate-500' : 'text-slate-700'}
        `}>
          {active > 0 ? `${active} SYNCED` : 'EMPTY'}
        </span>
      </div>
    </button>
  );
}