import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthUser } from './AuthProvider';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuthUser();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500/30 border-t-[#FACC15] rounded-full animate-spin" />
          <p className="text-sm font-bold text-amber-300">Authenticating Celestius Organizer...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
