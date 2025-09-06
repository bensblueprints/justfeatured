import { ReactElement, cloneElement } from 'react';
import { useEmailCapture } from '@/hooks/useEmailCapture';
import { EmailCollectionPopup } from '@/components/EmailCollectionPopup';

interface ProtectedInteractionProps {
  children: ReactElement;
  action?: () => void;
  source?: string;
}

export const ProtectedInteraction = ({ children, action, source = 'protected_interaction' }: ProtectedInteractionProps) => {
  const { isPopupOpen, currentSource, triggerEmailCapture, closePopup, handleEmailSubmitted } = useEmailCapture();

  const handleClick = (originalClick?: () => void) => {
    const actionToExecute = action || originalClick || (() => {});
    triggerEmailCapture(actionToExecute, source);
  };

  // Clone the child element and add the email capture click handler
  const enhancedChild = cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleClick(children.props.onClick);
    },
  });

  return (
    <>
      {enhancedChild}
      <EmailCollectionPopup
        isOpen={isPopupOpen}
        onClose={closePopup}
        onEmailSubmitted={handleEmailSubmitted}
        source={currentSource}
        title="Get Featured in Top Publications"
        description="Join thousands of entrepreneurs who've transformed their businesses with media coverage. Get exclusive access to our premium publication network."
      />
    </>
  );
};