import { useState, useCallback } from 'react';

export const useEmailCapture = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [currentSource, setCurrentSource] = useState<string>('');

  const triggerEmailCapture = useCallback((action: () => void, source: string) => {
    setPendingAction(() => action);
    setCurrentSource(source);
    setIsPopupOpen(true);
  }, []);

  const handleEmailSubmitted = useCallback(() => {
    // Execute the pending action after email is collected
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
    closePopup
  };
};