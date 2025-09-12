import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  selectedPublications: string[];
  addToCart: (publicationId: string) => void;
  removeFromCart: (publicationId: string) => void;
  clearCart: () => void;
  isInCart: (publicationId: string) => boolean;
  toggleCart: (publicationId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);

  const addToCart = (publicationId: string) => {
    setSelectedPublications(prev => 
      prev.includes(publicationId) ? prev : [...prev, publicationId]
    );
  };

  const removeFromCart = (publicationId: string) => {
    setSelectedPublications(prev => 
      prev.filter(id => id !== publicationId)
    );
  };

  const clearCart = () => {
    setSelectedPublications([]);
  };

  const isInCart = (publicationId: string) => {
    return selectedPublications.includes(publicationId);
  };

  const toggleCart = (publicationId: string) => {
    if (isInCart(publicationId)) {
      removeFromCart(publicationId);
    } else {
      addToCart(publicationId);
    }
  };

  return (
    <CartContext.Provider value={{
      selectedPublications,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};