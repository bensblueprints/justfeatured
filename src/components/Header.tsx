import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthWrapper";
import { User, LogOut, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { usePublicationsSync } from "@/hooks/usePublicationsSync";
import { useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  // Always call hooks at the top level
  const cartData = useCart();
  const publicationsData = usePublicationsSync();
  
  const { selectedPublications, removeFromCart, clearCart } = cartData;
  const { publications } = publicationsData;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path: string) => {
    if (location.pathname === '/' && path.startsWith('#')) {
      // Smooth scroll on homepage
      const element = document.querySelector(path);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (path.startsWith('#')) {
      // Navigate to home then scroll
      navigate('/' + path);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(147, 51, 234, 0.1)' }}>
      <div className="container py-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img 
            src="/lovable-uploads/48bef6ef-a90c-4a5c-84a3-116d85580bea.png"
            alt="Just Featured"
            className="h-8 cursor-pointer magnetic"
            onClick={() => navigate('/')}
          />
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8">
          <button 
            onClick={() => handleNavigation('/publications')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            Publications
          </button>
          <button 
            onClick={() => handleNavigation('/starter-selection')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            $97 Packages
          </button>
          <button 
            onClick={() => handleNavigation('/brand-bundles')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            Brand Bundles
          </button>
          <button 
            onClick={() => handleNavigation('/blog/trust-factor')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            Blog
          </button>
          <button 
            onClick={() => handleNavigation('#pricing')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            Pricing
          </button>
          <button 
            onClick={() => handleNavigation('#testimonials')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            Reviews
          </button>
        </nav>

        <div className="flex items-center space-x-4">
          {/* Cart - Always visible */}
          <CartDrawer
            selectedPublications={selectedPublications}
            publications={publications}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
          />
          
          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 z-50 relative bg-white/80 backdrop-blur-sm rounded-lg border border-primary/20 hover:bg-white/90 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
            style={{ color: '#475569' }}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop auth and CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass border-white/20">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="glass" 
                size="sm"
                onClick={() => navigate('/auth')}
                className="magnetic"
              >
                Login
              </Button>
            )}
            <button 
              className="cta-primary magnetic"
              onClick={() => handleNavigation('/starter-selection')}
            >
              Get Featured ✨
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-primary/10 shadow-lg z-40">
          <div className="container py-4 space-y-4">
            <nav className="space-y-4">
              <button 
                onClick={() => {
                  handleNavigation('/publications');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                style={{ color: '#475569' }}
              >
                Publications
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/starter-selection');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                style={{ color: '#475569' }}
              >
                $97 Packages
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/brand-bundles');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                style={{ color: '#475569' }}
              >
                Brand Bundles
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/blog/trust-factor');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                style={{ color: '#475569' }}
              >
                Blog
              </button>
              <button 
                onClick={() => {
                  handleNavigation('#pricing');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                style={{ color: '#475569' }}
              >
                Pricing
              </button>
              <button 
                onClick={() => {
                  handleNavigation('#testimonials');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                style={{ color: '#475569' }}
              >
                Reviews
              </button>
            </nav>
            
            <div className="border-t border-primary/10 pt-4 space-y-3">
              {user ? (
                <>
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 px-4 rounded-lg hover:bg-primary/5 transition-colors font-medium"
                >
                  Login
                </button>
              )}
              <button 
                className="cta-primary w-full text-center"
                onClick={() => {
                  handleNavigation('/starter-selection');
                  setIsMobileMenuOpen(false);
                }}
              >
                Get Featured ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};