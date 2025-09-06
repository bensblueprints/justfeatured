import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthWrapper';
import { AuthPopup } from '@/components/AuthPopup';

export const useAuthGuard = () => {
  const { user } = useAuth();
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = useCallback((action: () => void) => {
    if (user) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAuthPopup(true);
    }
  }, [user]);

  const handleAuthSuccess = useCallback(() => {
    setShowAuthPopup(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const handleAuthClose = useCallback(() => {
    setShowAuthPopup(false);
    setPendingAction(null);
  }, []);

  // Execute pending action when user logs in
  useEffect(() => {
    if (user && pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [user, pendingAction]);

  const AuthGuardComponent = () => (
    <AuthPopup
      open={showAuthPopup}
      onOpenChange={handleAuthClose}
      onSuccess={handleAuthSuccess}
    />
  );

  return {
    requireAuth,
    AuthGuardComponent,
    isAuthenticated: !!user,
  };
};