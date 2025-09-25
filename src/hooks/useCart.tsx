import { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  selectedPublications: string[];
  selectedServices: string[];
  addToCart: (itemId: string) => void;
  addServiceToCart: (serviceId: string) => void;
  removeFromCart: (itemId: string) => void;
  removeServiceFromCart: (serviceId: string) => void;
  clearCart: () => void;
  isInCart: (itemId: string) => boolean;
  isServiceInCart: (serviceId: string) => boolean;
  toggleCart: (itemId: string) => void;
  toggleServiceCart: (serviceId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const addToCart = (publicationId: string) => {
    console.log('Adding to cart:', publicationId);
    setSelectedPublications(prev => {
      const newCart = prev.includes(publicationId) ? prev : [...prev, publicationId];
      console.log('Cart updated:', newCart);
      return newCart;
    });
  };

  const addServiceToCart = (serviceId: string) => {
    console.log('Adding service to cart:', serviceId);
    setSelectedServices(prev => {
      const newCart = prev.includes(serviceId) ? prev : [...prev, serviceId];
      console.log('Service cart updated:', newCart);
      return newCart;
    });
  };

  const removeFromCart = (publicationId: string) => {
    setSelectedPublications(prev => 
      prev.filter(id => id !== publicationId)
    );
  };

  const removeServiceFromCart = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.filter(id => id !== serviceId)
    );
  };

  const clearCart = () => {
    setSelectedPublications([]);
    setSelectedServices([]);
  };

  const isInCart = (publicationId: string) => {
    return selectedPublications.includes(publicationId);
  };

  const isServiceInCart = (serviceId: string) => {
    return selectedServices.includes(serviceId);
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

  const toggleServiceCart = (serviceId: string) => {
    console.log('Toggling service cart for:', serviceId);
    if (isServiceInCart(serviceId)) {
      console.log('Removing service from cart');
      removeServiceFromCart(serviceId);
    } else {
      console.log('Adding service to cart');
      addServiceToCart(serviceId);
    }
  };

  return (
    <CartContext.Provider value={{
      selectedPublications,
      selectedServices,
      addToCart,
      addServiceToCart,
      removeFromCart,
      removeServiceFromCart,
      clearCart,
      isInCart,
      isServiceInCart,
      toggleCart,
      toggleServiceCart
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
      selectedServices: [],
      addToCart: () => {},
      addServiceToCart: () => {},
      removeFromCart: () => {},
      removeServiceFromCart: () => {},
      clearCart: () => {},
      isInCart: () => false,
      isServiceInCart: () => false,
      toggleCart: () => {},
      toggleServiceCart: () => {}
    };
  }
  return context;
};