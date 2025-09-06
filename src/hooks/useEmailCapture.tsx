import { useState, useCallback } from 'react';

interface UseEmailCaptureProps {
  defaultSource?: string;
}

export const useEmailCapture = ({ defaultSource = 'unknown' }: UseEmailCaptureProps = {}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState(defaultSource);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const triggerEmailCapture = useCallback((action?: () => void, source?: string) => {
    setCurrentSource(source || defaultSource);
    setPendingAction(() => action);
    setIsPopupOpen(true);
  }, [defaultSource]);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    setPendingAction(null);
  }, []);

  const onEmailSubmitted = useCallback(() => {
    // Execute the pending action after email is collected
    if (pendingAction) {
      pendingAction();
    }
  }, [pendingAction]);

  return {
    isPopupOpen,
    currentSource,
    triggerEmailCapture,
    closePopup,
    onEmailSubmitted
  };
};