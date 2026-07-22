import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthUser } from '../auth/AuthProvider';
import { LogOut, CheckCircle2 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, signOut, isDemoMode } = useAuthUser();
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    if (pathname.includes('/events/')) return 'Event Workspace';
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard Overview';
      case '/dashboard/events':
        return 'Events Management';
      case '/dashboard/templates':
        return 'Developer Template Registry';
      case '/dashboard/participants':
        return 'Participants Directory';
      case '/dashboard/credentials':
        return 'Credentials Explorer';
      case '/dashboard/settings':
        return 'Platform Settings';
      default:
        return 'Celestius Platform';
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-[#09090B]/90 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 rounded-full bg-[#FACC15] animate-pulse shadow-sm shadow-amber-400" />
        <h1 className="text-lg font-bold text-white font-['Outfit']">
          {getPageTitle(location.pathname)}
        </h1>
        <span className="hidden sm:inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Club Celestius
        </span>
      </div>

      {/* Right Actions & User Profile */}
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Backend Connected</span>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-md">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center text-zinc-950 text-xs font-black shadow-md shadow-amber-500/20">
            {user?.fullName?.charAt(0) || 'C'}
          </div>

          <div className="hidden sm:block text-left text-xs">
            <p className="font-bold text-white">{user?.fullName || 'Celestius Lead'}</p>
            <p className="text-[10px] text-zinc-400 font-mono">
              {isDemoMode ? 'Demo Organizer' : user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <button
            onClick={() => signOut()}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors ml-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
