import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/')}
          >
            Just Featured
          </h1>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            355+ Publications
          </Badge>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => handleNavigation('/publications')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Publications
          </button>
          <button 
            onClick={() => handleNavigation('#pricing')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </button>
          <button 
            onClick={() => handleNavigation('#testimonials')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Reviews
          </button>
        </nav>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button 
            variant="hero" 
            size="sm"
            onClick={() => handleNavigation('/publications')}
          >
            Get Featured
          </Button>
        </div>
      </div>
    </header>
  );
};