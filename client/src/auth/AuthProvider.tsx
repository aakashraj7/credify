import React, { createContext, useContext, useState } from 'react';
import { ClerkProvider, useUser, useClerk } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && !PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY');

interface DemoAuthContextType {
  isSignedIn: boolean;
  user: {
    fullName: string;
    primaryEmailAddress: { emailAddress: string };
    imageUrl?: string;
  } | null;
  loginDemo: () => void;
  logoutDemo: () => void;
  isDemoMode: boolean;
}

const DemoAuthContext = createContext<DemoAuthContextType>({
  isSignedIn: true,
  user: {
    fullName: 'Celestius Organizer',
    primaryEmailAddress: { emailAddress: 'organizer@celestius.org' }
  },
  loginDemo: () => {},
  logoutDemo: () => {},
  isDemoMode: true
});

export const useAuthUser = () => {
  if (isClerkConfigured) {
    const { isLoaded, isSignedIn, user } = useUser();
    const clerk = useClerk();

    return {
      isLoaded,
      isSignedIn: !!isSignedIn,
      user: user ? {
        fullName: user.fullName || user.firstName || 'Celestius Organizer',
        primaryEmailAddress: { emailAddress: user.primaryEmailAddress?.emailAddress || 'organizer@celestius.org' },
        imageUrl: user.imageUrl
      } : null,
      signOut: () => clerk.signOut(),
      isDemoMode: false
    };
  } else {
    const context = useContext(DemoAuthContext);
    return {
      isLoaded: true,
      isSignedIn: context.isSignedIn,
      user: context.user,
      signOut: context.logoutDemo,
      loginDemo: context.loginDemo,
      isDemoMode: true
    };
  }
};

export const AppAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [demoSignedIn, setDemoSignedIn] = useState<boolean>(true);

  if (isClerkConfigured) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY!}>
        {children}
      </ClerkProvider>
    );
  }

  return (
    <DemoAuthContext.Provider
      value={{
        isSignedIn: demoSignedIn,
        user: demoSignedIn
          ? {
              fullName: 'Celestius Core Organizer',
              primaryEmailAddress: { emailAddress: 'core@celestius.org' }
            }
          : null,
        loginDemo: () => setDemoSignedIn(true),
        logoutDemo: () => setDemoSignedIn(false),
        isDemoMode: true
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
};
