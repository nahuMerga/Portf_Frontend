import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, FolderGit2, ScrollText } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar if on the /admin route
  if (location.pathname.startsWith('/mek-nah-16-admin-4')) {
    return null;
  }

  if (location.pathname.startsWith('/mek-nah-16-log')) {
    return null;
  }

  const navItems = [
    { title: 'Home', path: '/', icon: Home },
    { title: 'Projects', path: '/projects', icon: FolderGit2 },
    { title: 'Blog', path: '/blog', icon: ScrollText },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 glass' : 'py-6'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-glow">
            naho<span className="text-primary">Mer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-all duration-300 hover:text-primary flex items-center gap-2 ${
                    location.pathname === item.path ? 'text-primary' : 'text-foreground'
                  }`}
                >
                  <Icon size={20} />
                  {item.title}
                </Link>
              );
            })}
            <Link
              to="/auth"
              className="px-4 py-2 rounded-md glass hover:bg-primary/20 transition-all duration-300"
            >
              Login
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass animate-fade-in">
            <div className="flex flex-col space-y-4 p-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`transition-all duration-300 hover:text-primary flex items-center gap-2 ${
                      location.pathname === item.path ? 'text-primary' : 'text-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={20} />
                    {item.title}
                  </Link>
                );
              })}
              <Link
                to="/auth"
                className="px-4 py-2 text-center rounded-md glass hover:bg-primary/20 transition-all duration-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
