import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthWrapper";
import { User, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

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
            src="/lovable-uploads/015f209e-04d1-4f5e-b773-0d2bfac5623f.png"
            alt="Just Featured"
            className="h-8 cursor-pointer magnetic"
            onClick={() => navigate('/')}
          />
          <div className="hidden sm:inline-flex glass-card rounded-full px-4 py-2">
            <span className="text-sm font-semibold" style={{ color: '#FF6B9D' }}>355+ Publications</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => handleNavigation('/publications')}
            className="transition-all duration-300 font-medium magnetic"
            style={{ color: '#475569' }}
          >
            Publications
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
            onClick={() => handleNavigation('/publications')}
          >
            Get Featured ✨
          </button>
        </div>
      </div>
    </header>
  );
};