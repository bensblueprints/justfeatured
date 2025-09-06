import { useState, useCallback } from 'react';

export const useEmailCapture = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [currentSource, setCurrentSource] = useState<string>('');

  const hasSubmittedEmail = () => {
    return localStorage.getItem('email_submitted') === 'true';
  };

  const markEmailSubmitted = () => {
    localStorage.setItem('email_submitted', 'true');
  };

  const triggerEmailCapture = useCallback((action: () => void, source: string) => {
    // If user has already submitted email, execute action immediately
    if (hasSubmittedEmail()) {
      action();
      return;
    }
    
    setPendingAction(() => action);
    setCurrentSource(source);
    setIsPopupOpen(true);
  }, []);

  const handleEmailSubmitted = useCallback(() => {
    // Mark email as submitted and execute the pending action
    markEmailSubmitted();
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setPendingAction(null);
    setCurrentSource('');
  }, []);

  return {
    isPopupOpen,
    currentSource,
    triggerEmailCapture,
    handleEmailSubmitted,
    closePopup,
    hasSubmittedEmail
  };
};