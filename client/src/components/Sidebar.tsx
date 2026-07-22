import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  Award,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

import credifyShortLogo from '../assets/credify-short-logo-without-bg(compressed).png';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Events', path: '/dashboard/events', icon: Calendar },
    { label: 'Templates', path: '/dashboard/templates', icon: Layers },
    { label: 'Participants', path: '/dashboard/participants', icon: Users },
    { label: 'Credentials', path: '/dashboard/credentials', icon: Award }
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="relative h-screen bg-[#09090B]/95 backdrop-blur-xl border-r border-zinc-800/80 flex flex-col justify-between z-30 select-none"
    >
      {/* Top Header / Branding */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <img
              src={credifyShortLogo}
              alt="Credify Logo Icon"
              className="w-10 h-10 object-contain drop-shadow-[0_4px_10px_rgba(250,204,21,0.3)] shrink-0"
            />
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-xl tracking-tight font-['Outfit'] text-white">Credify</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">PRO</span>
                </div>
                <p className="text-[10px] font-semibold text-amber-400/90">by Club Celestius</p>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-700/60 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-lg shadow-amber-500/10'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#FACC15]' : 'text-zinc-400 group-hover:text-zinc-200'}`} />
                    {!collapsed && <span>{item.label}</span>}
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FACC15] shadow-sm shadow-amber-400"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-zinc-800/80">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-400 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <ShieldCheck className="w-4 h-4 text-[#FACC15]" />
              <span>Celestius Platform</span>
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-400">Official internal credential manager for events.</p>
            <a
              href="/credential/CFY-8A2X7M91"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-bold hover:underline"
            >
              <span>Test Public View</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Club Celestius Internal Platform">
            <ShieldCheck className="w-5 h-5 text-[#FACC15]" />
          </div>
        )}
      </div>
    </motion.aside>
  );
};
