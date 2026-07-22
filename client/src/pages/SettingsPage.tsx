import React from 'react';
import { Key, Sparkles, CheckCircle2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white font-['Outfit']">Platform Settings</h1>
        <p className="text-xs text-slate-400">Club Celestius Credify system configuration & environment keys</p>
      </div>

      {/* Organization Info */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-['Outfit']">Organization Branding</h2>
            <p className="text-xs text-slate-400">Default issuer configuration for certificates & passes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Platform Identity</p>
            <p className="text-sm font-bold text-white font-['Outfit']">Credify — by Celestius</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Organization</p>
            <p className="text-sm font-bold text-amber-300 font-['Outfit']">Club Celestius Core</p>
          </div>
        </div>
      </div>

      {/* API Keys Configuration */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-['Outfit']">Environment API Keys (.env)</h2>
              <p className="text-xs text-slate-400">Configure keys in client/.env and server/.env</p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Defined & Configured</span>
          </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <p className="text-amber-400 font-bold font-sans">Frontend (.env)</p>
            <p className="text-slate-300">VITE_CLERK_PUBLISHABLE_KEY=pk_test_...</p>
            <p className="text-slate-300">VITE_API_BASE_URL=http://localhost:5000/api</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <p className="text-indigo-400 font-bold font-sans">Backend (.env)</p>
            <p className="text-slate-300">PORT=5000</p>
            <p className="text-slate-300">MONGODB_URI=mongodb://localhost:27017/credify</p>
            <p className="text-slate-300">CLERK_SECRET_KEY=sk_test_...</p>
          </div>
        </div>
      </div>
    </div>
  );
};
