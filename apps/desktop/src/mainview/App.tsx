import { useLocation, Route, Switch, Redirect } from "wouter";

import { useEffect, useState } from "react";
import {
  Brain,
  Activity,
  User as UserIcon,
  TrendingUp,
  Users,
  ShieldAlert,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

// --- TYPES & UI ---
import { AppState } from "./types/app";
import { NavItem } from "./components/layout/NavItem";

// --- FEATURES ---
import { OnboardingFlow } from "./features/onboarding/OnboardingFlow";
import { PulseModule } from "./features/pulse/PulseModule";
import { ChatModule } from "./features/chat/ChatModule";
import { MindModule } from "./features/mind/MindModule";
import { InsightsModule } from "./features/insights/InsightsModule";
import { ConnectModule } from "./features/connect/ConnectModule";
import { EmergencyModule } from "./features/emergency/EmergencyModule";
import { MeModule } from "./features/me/MeModule";
import { PremiumModule } from "./features/premium/PremiumModule";
import { AuthModule } from "./features/auth/AuthModule";
import { getPreferences, savePreferences } from "./lib/preferences";
import { authClient } from "./lib/auth-client";

export default function App() {
  // Initialize state synchronously to prevent mount-flicker
  const [prefs] = useState(() => getPreferences());
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(prefs.hasOnboarded);
  const [userData, setUserData] = useState<AppState['userData']>(prefs.userData);

  const { data: session, isPending } = authClient.useSession();
  const [location, setLocation] = useLocation();

  // Sync state back to LocalStorage when changed
  useEffect(() => {
    savePreferences({
      hasOnboarded,
      userData,
      lastRoute: location
    });

    // Apply theme to body
    if (userData.theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [hasOnboarded, userData, location]);

  const handleSetState: React.Dispatch<React.SetStateAction<AppState>> = (updater) => {
    if (typeof updater === 'function') {
      const next = updater({ hasOnboarded, userData, module: 'pulse', subScreen: 'main' } as any);
      setHasOnboarded(next.hasOnboarded);
      setUserData(next.userData);
    }
  };

  const isEmergency = location === "/emergency";

  const isAuthRoute = ["/login", "/register", "/recovery"].some(path => location.startsWith(path));

  // Identity Firewall: Block rendering while session is being resolved
  if (isPending || session === undefined) {
    return (
      <div className="h-screen bg-void flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-pulse-cyan blur-2xl opacity-20 animate-pulse"></div>
          <Activity className="relative z-10 text-pulse-cyan animate-pulse" size={48} />
        </div>
      </div>
    );
  }

  // Identity Guard: Redirect to gateway if unauthorized and not on an auth route
  if (!session && !isAuthRoute) {
    return <Redirect to="/login" />;
  }

  // Seamless Identity Restore: If already authenticated, bypass login/register/recovery
  if (session && isAuthRoute) {
    return <Redirect to={hasOnboarded ? "/pulse" : "/onboarding"} />;
  }

  // Calculate a stable key for animations (grouping aliases)
  const rawRoute = location.split('/')[1] || (hasOnboarded ? 'pulse' : 'onboarding');
  const rootRoute = (rawRoute === 'nexus' || rawRoute === 'connect') ? 'nexus'
    : (rawRoute === 'vault' || rawRoute === 'me') ? 'vault'
      : rawRoute;

  return (
    <div className="min-h-screen bg-[var(--background)] text-on-surface font-body selection:bg-pulse-cyan/30 overflow-hidden transition-standard">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 aurora-mesh opacity-40"></div>
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-pulse-purple/10 blur-[100px] opacity-30"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-pulse-cyan/10 blur-[120px] opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <AnimatePresence>
          <motion.main
            key={rootRoute}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 overflow-hidden relative"
          >
            <Switch>
              <Route path="/onboarding*">
                <OnboardingFlow setState={handleSetState} />
              </Route>

              <Route path="/pulse*"><PulseModule /></Route>
              <Route path="/chat*"><ChatModule /></Route>
              <Route path="/mind*"><MindModule /></Route>
              <Route path="/insights*"><InsightsModule /></Route>
              <Route path="/connect*"><ConnectModule /></Route>
              <Route path="/nexus*"><ConnectModule /></Route>
              <Route path="/emergency*"><EmergencyModule /></Route>
              <Route path="/me*">
                <MeModule state={{ hasOnboarded, userData, module: 'me' } as any} setState={handleSetState} />
              </Route>
              <Route path="/vault*">
                <MeModule state={{ hasOnboarded, userData, module: 'me' } as any} setState={handleSetState} />
              </Route>
              <Route path="/premium*"><PremiumModule /></Route>
              <Route path="/login*"><AuthModule /></Route>
              <Route path="/register*"><AuthModule /></Route>
              <Route path="/recovery*"><AuthModule /></Route>

              <Route>
                <Redirect to={hasOnboarded ? "/pulse" : "/onboarding"} />
              </Route>
            </Switch>
          </motion.main>
        </AnimatePresence>

        {/* Global Navigation */}
        {hasOnboarded && !isEmergency && (
          <nav className="shrink-0 z-50 bg-surface-highest/90 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center pt-5 pb-10 px-6 shadow-nav">
            <NavItem active={location.startsWith("/mind")} icon={<Brain size={28} />} label="Mind" to="/mind" />
            <NavItem active={location.startsWith("/insights")} icon={<TrendingUp size={28} />} label="Data" to="/insights" />

            <div className="relative -top-8">
              <div className="absolute inset-0 bg-pulse-cyan blur-2xl opacity-25 animate-pulse"></div>
              <button
                onClick={() => setLocation("/pulse")}
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 hover:scale-105 relative z-10 ${location.startsWith("/pulse") ? "bg-pulse-cyan text-void" : "bg-surface-highest text-pulse-cyan"
                  }`}
              >
                <Activity size={36} />
              </button>
              <span className="block text-[11px] text-center font-black tracking-[0.2em] text-on-surface-low mt-3 uppercase">Pulse</span>
            </div>

            <NavItem active={location.startsWith("/connect") || location.startsWith("/nexus")} icon={<Users size={28} />} label="Nexus" to="/nexus" />
            <NavItem active={location.startsWith("/me")} icon={<UserIcon size={28} />} label="Vault" to="/me" />
          </nav>
        )}
      </div>

      {/* Emergency Global Trigger */}
      {hasOnboarded && !isEmergency && (
        <button
          onClick={() => setLocation("/emergency")}
          className="fixed bottom-28 left-6 w-12 h-12 glass-panel rounded-full flex items-center justify-center text-pulse-pink shadow-[0_0_20px_rgba(241,91,181,0.2)] z-50 hover:bg-pulse-pink hover:text-white transition-all border border-pulse-pink/20"
        >
          <ShieldAlert size={24} />
        </button>
      )}
    </div>
  );
}
