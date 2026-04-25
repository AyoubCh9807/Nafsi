import { useState } from "react";
import { Zap, ArrowRight, UserPlus, LogIn, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { authClient } from "../../lib/auth-client";

const GoogleIcon = ({ size = 20 }: { size?: number }) => (
   <svg viewBox="0 0 24 24" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335" />
   </svg>
);

const AppleIcon = ({ size = 20 }: { size?: number }) => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      className="bi bi-apple"
      viewBox="0 0 16 16"
   >
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
   </svg>
);


export function AuthModule() {
   return (
      <div className="h-full relative overflow-hidden">
         <Switch>
            <Route path="/login">
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="h-full">
                  <LoginScreen />
               </motion.div>
            </Route>
            <Route path="/register">
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                  <RegisterScreen />
               </motion.div>
            </Route>
            <Route path="/recovery">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full">
                  <RecoveryScreen />
               </motion.div>
            </Route>
            <Route path="/"><Redirect to="/login" /></Route>
         </Switch>
      </div>
   );
}

function LoginScreen() {
   const [, setLocation] = useLocation();
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [safetyTaps, setSafetyTaps] = useState(0);

   const enterDecoyMode = () => {
      sessionStorage.setItem("nafsi_decoy_active", "true");
      window.location.reload();
   };

   const handleLogin = async () => {
      if (password === "0000") {
         enterDecoyMode();
         return;
      }
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      try {
         const { data, error: authError } = await authClient.signIn.email({ email, password });
         if (authError) {
            setError(authError.message || "Authentication failed. Please check your credentials.");
         } else {
            console.log("Logged in:", data);
         }
      } catch (e) {
         setError("A neural connection error occurred. Try again later.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="screen-container space-y-10">
         <div className="space-y-6">
            <div
               onClick={() => {
                  setSafetyTaps(prev => {
                     if (prev >= 2) {
                        enterDecoyMode();
                        return 0;
                     }
                     return prev + 1;
                  });
                  setTimeout(() => setSafetyTaps(0), 2000);
               }}
               className="w-20 h-20 glass-panel flex items-center justify-center p-3 cursor-pointer active:scale-90 transition-transform"
            >
               <img src="/logo.png" alt="Nafsi Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-5xl font-display font-black tracking-tighter leading-none uppercase">RECONNECT</h2>
            <p className="text-on-surface-low font-arabic text-lg leading-relaxed">{safetyTaps > 0 ? "INITIATING_SAFE_SYNC..." : "أدخل بريدك الإلكتروني للوصول إلى بياناتك المشفرة."}</p>
         </div>

         <div className="space-y-8">
            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[12px] uppercase font-bold tracking-[0.35em] text-slate-500 block px-1 text-left">Email Endpoint</label>
                  <div className="relative">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="identity@sanctuary.com"
                        className="w-full bg-surface-low border-b border-white/10 pl-14 pr-4 py-5 text-lg text-white focus:outline-none focus:border-pulse-cyan transition-all"
                        disabled={isLoading}
                     />
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                     <label className="text-[12px] uppercase font-bold tracking-[0.35em] text-slate-500">Neural Passphrase</label>
                     <button onClick={() => setLocation("/recovery")} className="text-[10px] text-pulse-pink uppercase font-black tracking-widest hover:opacity-80 transition-opacity" disabled={isLoading}>Forgotten Key?</button>
                  </div>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full bg-surface-low border-b border-white/10 px-6 py-5 text-lg text-white focus:outline-none focus:border-pulse-cyan transition-all"
                     disabled={isLoading}
                  />
               </div>

               {error && (
                  <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-4 bg-pulse-pink/10 border border-pulse-pink/20 text-pulse-pink text-[11px] font-black uppercase tracking-widest text-center"
                  >
                     {error}
                  </motion.div>
               )}
            </div>

            <button
               onClick={handleLogin}
               disabled={isLoading || !email || !password}
               className={`w-full py-6 transition-standard uppercase tracking-widest text-sm flex items-center justify-center gap-3 active-scale shadow-[0_0_30px_rgba(0,245,212,0.25)] ${isLoading || !email || !password ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-pulse-cyan text-void font-black'
                  }`}
            >
               {isLoading ? "Synchronizing..." : "Sync Vault"}
               <Zap size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
         </div>

         <div className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="h-[1px] flex-1 bg-white/5" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">External Sync</span>
               <div className="h-[1px] flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button
                  disabled={isLoading}
                  onClick={() => authClient.signIn.social({ provider: "google" })}
                  className="flex items-center justify-center gap-2 py-5 glass-panel border-white/5 hover:bg-white/5 transition-all active:scale-[0.95] disabled:opacity-50"
               >
                  <GoogleIcon size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Google</span>
               </button>
               <button
                  disabled={isLoading}
                  onClick={() => authClient.signIn.social({ provider: "apple" })}
                  className="flex items-center justify-center gap-2 py-5 glass-panel border-white/5 hover:bg-white/5 transition-all active:scale-[0.95] disabled:opacity-50"
               >
                  <AppleIcon size={20} />
                  <span className="text-[11px] font-black uppercase tracking-widest">Apple</span>
               </button>
            </div>

            <button
               disabled={isLoading || !email}
               onClick={async () => {
                  setError(null);
                  setIsLoading(true);
                  const { error: magicError } = await authClient.signIn.magicLink({ email });
                  if (magicError) {
                     setError(magicError.message || "Failed to transmit link.");
                  } else {
                     alert("Magic link transmitted to your neural endpoint.");
                  }
                  setIsLoading(false);
               }}
               className="w-full py-5 glass-panel border-white/5 flex items-center justify-center gap-3 hover:bg-white/5 transition-all active:scale-[0.95] disabled:opacity-50"
            >
               <Mail size={20} className="text-pulse-cyan/60" />
               <span className="text-[11px] font-black uppercase tracking-widest">
                  {isLoading ? "Transmitting..." : "Email Magic Link / OTP"}
               </span>
            </button>
         </div>

         <button
            onClick={() => setLocation("/register")}
            disabled={isLoading}
            className="w-full py-6 text-[12px] text-slate-500 uppercase font-black tracking-widest flex items-center justify-center gap-3 hover:text-white transition-all mt-4 disabled:opacity-50"
         >
            <UserPlus size={18} />
            Construct New Identity
         </button>
      </div>
   );
}

function RecoveryScreen() {
   const [, setLocation] = useLocation();
   const [recoveryMethod, setRecoveryMethod] = useState<"email" | "seed">("email");
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   return (
      <div className="screen-container space-y-12">
         <div className="space-y-6">
            <div className="w-20 h-20 glass-panel flex items-center justify-center p-3">
               <img src="/logo.png" alt="Nafsi Logo" className="w-full h-full object-contain grayscale opacity-50" />
            </div>
            <h2 className="text-5xl font-display font-black tracking-tighter leading-none uppercase text-white">RECOVERY</h2>
            <p className="text-on-surface-low font-arabic text-lg leading-relaxed">استعد هويتك عبر البريد أو المفتاح الفيزيائي.</p>
         </div>

         <div className="space-y-10 flex-1">
            <div className="flex glass-panel p-1.5 rounded-xl border-white/5">
               <button
                  onClick={() => setRecoveryMethod("email")}
                  className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${recoveryMethod === "email" ? "bg-pulse-pink text-white shadow-lg shadow-pulse-pink/20" : "text-slate-600 hover:text-slate-400"}`}
               >
                  Email Sync
               </button>
               <button
                  onClick={() => setRecoveryMethod("seed")}
                  className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${recoveryMethod === "seed" ? "bg-pulse-pink text-white shadow-lg shadow-pulse-pink/20" : "text-slate-600 hover:text-slate-400"}`}
               >
                  Recovery Seed
               </button>
            </div>

            <div className="space-y-6">
               {recoveryMethod === "email" ? (
                  <div className="space-y-6">
                     <div className="space-y-3 text-left">
                        <label className="text-[12px] uppercase font-bold tracking-[0.35em] text-slate-500 block px-1">Registered Neural Email</label>
                        <div className="relative">
                           <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                           <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="identity@sanctuary.com"
                              className="w-full bg-surface-low border-b border-white/10 pl-14 pr-4 py-5 text-lg text-white focus:outline-none focus:border-pulse-pink transition-all"
                              disabled={isLoading}
                           />
                        </div>
                     </div>
                     <p className="text-[11px] text-slate-500 uppercase font-black tracking-widest leading-relaxed text-left px-1 opacity-60">
                        A neural recovery link will be transmitted to your registered email address for identity verification.
                     </p>
                  </div>
               ) : (
                  <div className="space-y-6">
                     <div className="space-y-3 text-left">
                        <label className="text-[12px] uppercase font-bold tracking-[0.35em] text-slate-500 block px-1">Input 12-Word Seed</label>
                        <textarea
                           className="w-full bg-surface-low border border-white/5 p-6 text-sm font-mono text-pulse-pink focus:outline-none focus:border-pulse-pink transition-all min-h-[160px] resize-none leading-relaxed"
                           placeholder="word1 word2 word3..."
                        />
                     </div>
                  </div>
               )}
            </div>
         </div>

         <div className="space-y-4">
            <button
               disabled={isLoading || (recoveryMethod === "email" && !email)}
               onClick={async () => {
                  if (recoveryMethod === "email") {
                     setIsLoading(true);
                     // Implement actual recovery logic if needed
                     setTimeout(() => {
                        alert("Recovery protocol initiated.");
                        setIsLoading(false);
                     }, 1500);
                  }
               }}
               className={`w-full py-6 bg-pulse-pink text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-[0_0_30px_rgba(241,91,181,0.25)] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
               {isLoading ? "Processing..." : (recoveryMethod === "email" ? "Transmit Link" : "Reconstruct Access")}
               <ArrowRight size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
            <button
               onClick={() => setLocation("/login")}
               disabled={isLoading}
               className="w-full py-5 text-[12px] text-slate-500 uppercase font-black tracking-widest hover:text-white transition-colors disabled:opacity-50"
            >
               Return to Origin
            </button>
         </div>
      </div>
   );
}

function RegisterScreen() {
   const [, setLocation] = useLocation();
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const getStrength = (pwd: string) => {
      if (!pwd) return { level: 0, label: "Awaiting Input", color: "bg-white/5", text: "text-on-surface-low" };
      if (pwd.length < 6) return { level: 1, label: "NEURAL_VULNERABILITY", color: "bg-pulse-pink", text: "text-pulse-pink" };

      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score++;
      if (/[^A-Za-z0-9]/.test(pwd)) score++;

      if (score < 1) return { level: 1, label: "WEAK_ENCRYPTION", color: "bg-pulse-pink", text: "text-pulse-pink" };
      if (score < 3) return { level: 2, label: "SECURE_SYNC", color: "bg-pulse-yellow", text: "text-pulse-yellow" };
      return { level: 3, label: "ENCRYPTION_OPTIMIZED", color: "bg-pulse-cyan", text: "text-pulse-cyan" };
   };

   const strength = getStrength(password);

   const handleRegister = async () => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);

      try {
         const { data, error: registerError } = await authClient.signUp.email({
            email,
            password,
            name: "Anonymous User"
         });

         if (registerError) {
            setError(registerError.message || "Construction failed. Ensure your email is unique.");
         } else {
            console.log("Registered:", data);
         }
      } catch (e) {
         setError("Connection to Sanctuary lost. Try reconnecting.");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="screen-container space-y-10">
         <div className="space-y-6">
            <div className="w-20 h-20 glass-panel flex items-center justify-center p-3">
               <img src="/logo.png" alt="Nafsi Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-5xl font-display font-black tracking-tighter leading-none uppercase">CONSTRUCT</h2>
            <p className="text-on-surface-low font-arabic text-lg leading-relaxed">أنشئ هوية رقمية جديدة للوصول إلى الملاذ.</p>
         </div>

         <div className="space-y-8 flex-1">
            <div className="space-y-6">
               <div className="space-y-3">
                  <label className="text-[12px] uppercase font-bold tracking-[0.35em] text-slate-500 block px-1 text-left">Neural Email</label>
                  <div className="relative">
                     <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="identity@sanctuary.com"
                        className="w-full bg-surface-low border-b border-white/10 pl-14 pr-4 py-5 text-lg text-white focus:outline-none focus:border-pulse-purple transition-all"
                        disabled={isLoading}
                     />
                  </div>
               </div>
               <div className="space-y-6 text-left">
                  <div className="space-y-3">
                     <label className="text-[12px] uppercase font-bold tracking-[0.35em] text-slate-500 block px-1">Secure Passphrase</label>
                     <input
                        type="password"
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-surface-low border-b border-white/10 px-6 py-5 text-lg text-white focus:outline-none focus:border-pulse-purple transition-all"
                        disabled={isLoading}
                     />
                  </div>

                  {/* Strength Indicator */}
                  <div className="space-y-3 px-1">
                     <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${strength.text}`}>{strength.label}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700">Entropy Level</span>
                     </div>
                     <div className="flex gap-2 h-1.5">
                        {[1, 2, 3].map((i) => (
                           <div
                              key={i}
                              className={`flex-1 rounded-full transition-all duration-500 ${i <= strength.level ? strength.color : 'bg-white/5'}`}
                           />
                        ))}
                     </div>
                  </div>
               </div>

               {error && (
                  <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-4 bg-pulse-pink/10 border border-pulse-pink/20 text-pulse-pink text-[11px] font-black uppercase tracking-widest text-center"
                  >
                     {error}
                  </motion.div>
               )}
            </div>

            <div className="p-6 glass-panel border-pulse-purple/20 text-left">
               <p className="text-[12px] text-slate-400 uppercase font-bold tracking-widest leading-relaxed">
                  By generating an identity, you agree to the Neural Privacy Manifesto and Sanctuary Protocols.
               </p>
            </div>
         </div>

         <div className="space-y-4">
            <button
               onClick={handleRegister}
               disabled={isLoading || !email || password.length < 8}
               className={`w-full py-6 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-standard active-scale shadow-[0_0_30px_rgba(155,93,229,0.25)] ${isLoading || !email || password.length < 8 ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' : 'bg-pulse-purple'
                  }`}
            >
               {isLoading ? "Generating..." : "Generate Identity"}
               <ArrowRight size={20} className={isLoading ? "animate-pulse" : ""} />
            </button>
            <button
               onClick={() => setLocation("/login")}
               disabled={isLoading}
               className="w-full py-5 text-[12px] text-slate-500 uppercase font-black tracking-widest flex items-center justify-center gap-3 hover:text-white transition-all disabled:opacity-50"
            >
               <LogIn size={18} />
               Access Existing Vault
            </button>
         </div>
      </div>
   );
}


