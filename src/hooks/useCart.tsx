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
    console.log('Adding to cart:', publicationId);
    setSelectedPublications(prev => {
      const newCart = prev.includes(publicationId) ? prev : [...prev, publicationId];
      console.log('Cart updated:', newCart);
      return newCart;
    });
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
    console.log('Toggling cart for:', publicationId);
    if (isInCart(publicationId)) {
      console.log('Removing from cart');
      removeFromCart(publicationId);
    } else {
      console.log('Adding to cart');
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
    console.error('useCart must be used within a CartProvider');
    // Return a fallback object to prevent crashes
    return {
      selectedPublications: [],
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      isInCart: () => false,
      toggleCart: () => {}
    };
  }
  return context;
};