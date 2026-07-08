
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTranslation } from '@/hooks/useTranslation.js';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.gallery'), path: '/gallery' },
    { name: t('nav.clients'), path: '/clients' },
    { name: t('nav.careers'), path: '/careers' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src="https://horizons-cdn.hostinger.com/0fbf01b6-28c7-4623-ba2e-62114b48b0f6/b439283246ab46f18acfac7d6df67b60.png" 
                alt="Saeklindo" 
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-all duration-200 relative ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-[1.3rem] left-0 right-0 h-0.5 bg-primary" />
                  )}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="lang-switcher">
                <button 
                  onClick={() => setLanguage('id')}
                  className={`lang-btn ${language === 'id' ? 'active' : ''}`}
                  aria-label="Switch to Indonesian"
                >
                  ID
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
              </div>

              {!isAuthenticated ? (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link 
                        to="/login" 
                        className="p-2 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110 rounded-lg hover:bg-accent"
                        aria-label={t('nav.adminLogin')}
                      >
                        <Lock className="w-5 h-5" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>{t('nav.adminLogin')}</TooltipContent>
                  </Tooltip>
                  <Button asChild>
                    <a 
                      href="https://wa.me/6289670691999" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {t('nav.contact')}
                    </a>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/admin">{t('nav.dashboard')}</Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    {t('nav.logout')}
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button 
                onClick={toggleLanguage}
                className="p-2 text-sm font-medium flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <Globe className="w-4 h-4" />
                {language.toUpperCase()}
              </button>
              <button
                className="p-2 hover:bg-accent rounded-lg transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-sm font-medium py-2 transition-all duration-200 ${
                      isActive(link.path)
                        ? 'text-primary'
                        : 'text-foreground/80'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="h-px bg-border my-2" />
                
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="text-sm font-medium py-2 text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Lock className="w-4 h-4" />
                      {t('nav.adminLogin')}
                    </Link>
                    <Button asChild className="w-full">
                      <a 
                        href="https://wa.me/6289670691999" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('nav.contact')}
                      </a>
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      className="text-sm font-medium py-2 text-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <Button variant="outline" className="w-full" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                      {t('nav.logout')}
                    </Button>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
    </TooltipProvider>
  );
};

export default Header;
