
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect for nav bar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6",
        scrolled ? "glass shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-105"
        >
          <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            PokéIndex
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" active={isActive('/')}>
            <Home size={18} className="mr-1" />
            <span>Home</span>
          </NavLink>
          
          <NavLink to="/search" active={isActive('/search')}>
            <Search size={18} className="mr-1" />
            <span>Search</span>
          </NavLink>
          
          <NavLink to="/favorites" active={isActive('/favorites')}>
            <Heart size={18} className="mr-1" />
            <span>Favorites</span>
          </NavLink>
        </nav>

        <div className="flex md:hidden items-center space-x-3">
          <MobileNavLink to="/" active={isActive('/')}>
            <Home size={20} />
          </MobileNavLink>
          
          <MobileNavLink to="/search" active={isActive('/search')}>
            <Search size={20} />
          </MobileNavLink>
          
          <MobileNavLink to="/favorites" active={isActive('/favorites')}>
            <Heart size={20} />
          </MobileNavLink>
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
      active 
        ? "bg-primary text-white shadow-md" 
        : "text-foreground hover:bg-secondary"
    )}
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, active, children }: NavLinkProps) => (
  <Link
    to={to}
    className={cn(
      "p-2 rounded-full transition-all duration-200",
      active 
        ? "bg-primary text-white shadow-md" 
        : "text-foreground hover:bg-secondary"
    )}
  >
    {children}
  </Link>
);

export default Navbar;
