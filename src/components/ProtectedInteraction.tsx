import { ReactElement, cloneElement } from 'react';
import { useAuthGuard } from '@/hooks/useAuthGuard';

interface ProtectedInteractionProps {
  children: ReactElement;
  action?: () => void;
}

export const ProtectedInteraction = ({ children, action }: ProtectedInteractionProps) => {
  const { requireAuth } = useAuthGuard();

  const handleClick = (originalClick?: () => void) => {
    const actionToExecute = action || originalClick || (() => {});
    requireAuth(actionToExecute);
  };

  // Clone the child element and add the protected click handler
  const enhancedChild = cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      handleClick(children.props.onClick);
    },
  });

  return enhancedChild;
};