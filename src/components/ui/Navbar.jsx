import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const viaIcon = '/icon.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const navItems = [
    { label: 'Inicio', path: '/', index: 0 },
    { label: 'Acerca de', path: '/about', index: null },
    { label: 'Mapeo', path: '/maping', index: 1 },
    { label: 'Rutas', path: '/rutas', index: null },
  ];

  // Listen to active snap panel updates from LandingPage view
  useEffect(() => {
    const handlePanelChange = (e) => {
      setActiveIndex(e.detail);
      setIsMenuOpen(false); // Close mobile drawer when active section changes on scroll
    };
    window.addEventListener('activePanelChange', handlePanelChange);
    return () => window.removeEventListener('activePanelChange', handlePanelChange);
  }, []);

  // Track window scroll to add extra frost effect when page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track responsive screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLinkClick = (path, index) => {
    setIsMenuOpen(false);
    
    if (path !== location.pathname) {
      navigate(path);
      // Wait for path component to render in DOM, then execute smooth scroll
      if (index !== null) {
        setTimeout(() => {
          const panel = document.querySelector(`.scroll-panel[data-index="${index}"]`);
          if (panel) {
            panel.scrollIntoView({ behavior: 'smooth' });
          }
        }, 120);
      }
    } else {
      if (index !== null) {
        const panel = document.querySelector(`.scroll-panel[data-index="${index}"]`);
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '76px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isMobile ? '0 20px' : '0 48px',
          background: isScrolled || isMenuOpen
            ? 'rgba(11, 13, 23, 0.75)'
            : 'transparent',
          backdropFilter: isScrolled || isMenuOpen ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled || isMenuOpen ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.2)' : 'none',
          zIndex: 1000,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => handleLinkClick('/', 0)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {/* Custom Icon Wrapper */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(241, 134, 40, 0.2) 0%, rgba(244, 185, 95, 0.2) 100%)',
              border: '1px solid rgba(244, 185, 95, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(244, 185, 95, 0.1)',
            }}
          >
            <img src={viaIcon} alt="VIA Icon" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
          </div>
          
          <span
            style={{
              fontFamily: "'Yeseva One', serif",
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFF8E7',
              letterSpacing: '0.04em',
              textShadow: '0 0 10px rgba(255, 248, 231, 0.3), 0 0 20px rgba(244, 185, 95, 0.2)',
            }}
          >
            VIA
          </span>
        </div>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '40px',
            }}
          >
            {navItems.map((item, idx) => {
              // Determine active state based on route path and panel index
              const isRouteActive = location.pathname === item.path;
              const isActive = item.index !== null
                ? isRouteActive && activeIndex === item.index
                : isRouteActive;

              return (
                <div
                  key={idx}
                  onClick={() => handleLinkClick(item.path, item.index)}
                  style={{
                    position: 'relative',
                    padding: '8px 0',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Inter', system-ui, sans-serif",
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? '#F4B95F' : 'rgba(255, 255, 255, 0.65)',
                      transition: 'all 0.3s ease',
                      letterSpacing: '0.03em',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = '#FFF8E7';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)';
                    }}
                  >
                    {item.label}
                  </span>
                  
                  {/* Active dot */}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-4px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: '#F4B95F',
                        boxShadow: '0 0 8px #F4B95F, 0 0 15px #F4B95F',
                        animation: 'pulseDot 1.5s infinite ease-in-out',
                      }}
                    />
                  )}
                </div>
              );
            })}
                    {/* Desktop CTA Button */}
        {!isMobile && (
          <a
            href="https://play.google.com/store/apps/details?id=com.hir4m.hirashi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 24px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #F18628 0%, #F4B95F 100%)',
              border: 'none',
              color: '#ffffff',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(241, 134, 40, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(241, 134, 40, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(241, 134, 40, 0.25)';
            }}
          >
            Descargar
          </a>
        )}
          </nav>
        )}



        {/* Mobile Menu Toggle Button */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFF8E7',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1010,
              transition: 'all 0.3s ease',
            }}
          >
            {isMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        )}
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: '76px',
            left: 0,
            right: 0,
            background: 'rgba(11, 13, 23, 0.95)',
            backdropFilter: 'blur(25px)',
            WebkitBackdropFilter: 'blur(25px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px 32px',
            gap: '20px',
            transform: isMenuOpen ? 'translateY(0)' : 'translateY(-110%)',
            opacity: isMenuOpen ? 1 : 0,
            pointerEvents: isMenuOpen ? 'auto' : 'none',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {navItems.map((item, idx) => {
            const isRouteActive = location.pathname === item.path;
            const isActive = item.index !== null
              ? isRouteActive && activeIndex === item.index
              : isRouteActive;

            return (
              <div
                key={idx}
                onClick={() => handleLinkClick(item.path, item.index)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(244, 185, 95, 0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(244, 185, 95, 0.2)' : '1px solid transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontSize: '16px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#F4B95F' : 'rgba(255, 255, 255, 0.75)',
                  }}
                >
                  {item.label}
                </span>

                {isActive && (
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#F4B95F',
                      boxShadow: '0 0 8px #F4B95F',
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* Mobile CTA */}
          <a
            href="https://play.google.com/store/apps/details?id=com.hir4m.hirashi"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            style={{
              textDecoration: 'none',
              textAlign: 'center',
              padding: '14px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #F18628 0%, #F4B95F 100%)',
              color: '#ffffff',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              marginTop: '10px',
              boxShadow: '0 8px 24px rgba(241, 134, 40, 0.3)',
            }}
          >
            Descargar App
          </a>
        </div>
      )}

      {/* Global CSS animation rules */}
      <style>{`
        @keyframes pulseDot {
          0% { transform: translate(-50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%) scale(1.3); opacity: 1; boxShadow: 0 0 12px #F4B95F, 0 0 20px #F4B95F; }
          100% { transform: translate(-50%) scale(1); opacity: 0.8; }
        }
      `}</style>
    </>
  );
}