import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../auth/AuthProvider';
import { SignIn } from '@clerk/clerk-react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import credifyCompleteLogo from '../assets/credify-complete-logo-without-bg(compressed).png';

export const LoginPage: React.FC = () => {
  const { isLoaded, isSignedIn, isDemoMode, loginDemo } = useAuthUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('organizer@celestius.org');
  const [password, setPassword] = useState('celestius123');
  const [loading, setLoading] = useState(false);

  // Auto redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (loginDemo) loginDemo();
      setLoading(false);
      navigate('/dashboard', { replace: true });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md glass-panel-gold rounded-3xl p-8 border border-amber-500/30 relative z-10 shadow-2xl flex flex-col items-center"
      >
        {/* Header Branding */}
        <div className="text-center space-y-3 mb-6 w-full">
          <img
            src={credifyCompleteLogo}
            alt="Credify by Club Celestius"
            className="h-14 max-w-[220px] object-contain mx-auto drop-shadow-xl"
          />
          <p className="text-xs text-zinc-400">Club Celestius Event Credentials Portal</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-300">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Celestius Organizer Access Only</span>
          </div>
        </div>

        {/* Real Clerk Authentication component vs Demo Authentication */}
        {!isDemoMode ? (
          <div className="w-full flex justify-center py-2">
            <SignIn
              forceRedirectUrl="/dashboard"
              fallbackRedirectUrl="/dashboard"
              signUpUrl="/login"
              appearance={{
                elements: {
                  card: 'bg-[#121215] border border-amber-500/30 text-white shadow-2xl rounded-3xl',
                  headerTitle: 'text-white font-bold',
                  headerSubtitle: 'text-slate-400 text-xs',
                  socialButtonsBlockButton: 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800',
                  formButtonPrimary: 'gradient-button text-white border-0 py-3 rounded-xl font-bold',
                  formFieldInput: 'glass-input px-4 py-2.5 rounded-xl text-sm',
                  footer: 'hidden'
                }
              }}
            />
          </div>
        ) : (
          <form onSubmit={handleDemoLogin} className="space-y-4 w-full">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Organizer Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                placeholder="organizer@celestius.org"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-button py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Login to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-[#131B2E] px-3 text-[11px] font-medium text-slate-400">
                SUPPORTED AUTHENTICATION
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs font-medium text-slate-300 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Google Login</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center text-xs font-medium text-zinc-300 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Email Login</span>
              </div>
            </div>
          </form>
        )}

        <p className="text-[11px] text-center text-zinc-400 mt-6 leading-relaxed">
          Public attendees do not require login. Event credentials can be verified publicly at <code className="text-amber-300 font-bold">/credential/:id</code>.
        </p>
      </motion.div>
    </div>
  );
};
