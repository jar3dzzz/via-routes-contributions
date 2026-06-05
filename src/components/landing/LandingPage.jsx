import React, { useEffect, useState } from 'react';
import { HomeScreen } from "./HomeScreen";
import { ShowRoutesScreen } from './ShowRoutesScreen';
import { MainFunctionScreen } from './MainFunctionScreen';
import { AdsScreen } from './AdsScreen';
export function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('activePanelChange', { detail: activeIndex }));
  }, [activeIndex]);

  const panelStyle = {
    scrollSnapAlign: 'start',
    height: '100vh',
    width: '100%',
    backgroundColor: 'rgba(11, 13, 23, 0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(30px)',
    position: 'relative',
    zIndex: 1,
    overflow: 'hidden',
  };
  // Setup global scroll snapping and IntersectionObserver
  useEffect(() => {
    document.documentElement.style.scrollSnapType = 'y mandatory';
    document.body.style.margin = '0';
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.dataset.index, 10);
          setActiveIndex(index);
        }
      });
    }, { threshold: 0.5 }); // Fire when a panel is at least 50% visible
    
    const panels = document.querySelectorAll('.scroll-panel');
    panels.forEach(panel => observer.observe(panel));

    // Scroll to mapping panel 1 on initial load if route path is /maping
    if (window.location.hash.includes('/maping')) {
      setTimeout(() => {
        const panel = document.querySelector('.scroll-panel[data-index="1"]');
        if (panel) {
          panel.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }

    return () => {
      document.documentElement.style.scrollSnapType = '';
      observer.disconnect();
    };
  }, []);
  return (
    <div style={{ width: '100%' }}>
      
      {/* Fixed Background Layer: Always behind everything, fully interactive! */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <HomeScreen activeIndex={activeIndex} />
      </div>
      {/* 0: Transparent spacer allows the HomeScreen to be visible initially */}
      <div className="scroll-panel" data-index="0" style={{ height: '100vh', width: '100%', scrollSnapAlign: 'start', pointerEvents: 'none' }} />
      
      {/* 1: Features Screen with blurred background */}
      <div className="scroll-panel" data-index="1" style={panelStyle}>
        <ShowRoutesScreen />
      </div>
      {/* 2: Dashboard Screen with blurred background */}
      <div className="scroll-panel" data-index="2" style={panelStyle}>
        <MainFunctionScreen />
      </div>
      {/* 3: Profile Screen with blurred background */}
      <div className="scroll-panel" data-index="3" style={panelStyle}>
        <AdsScreen/>
      </div>
      {/* 4: Final Transparent Spacer to reveal the full Night Sky (sunset5) */}
      <div className="scroll-panel" data-index="4" style={{ height: '100vh', width: '100%', scrollSnapAlign: 'start', pointerEvents: 'none' }} />
    </div>
  );
}