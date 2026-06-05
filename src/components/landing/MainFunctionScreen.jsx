import React, { useRef, useEffect, useState } from 'react';
import { PhoneMockup } from "../ui/PhoneMockup";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const videoSrc = '/via3.mp4';
  
gsap.registerPlugin(ScrollTrigger);

export function MainFunctionScreen() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let ctx;
    const timer = setTimeout(() => {
      if (!sectionRef.current) return;
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          }
        });

        tl.fromTo(sectionRef.current, 
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
        )
        .fromTo(".phone-animate",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(".badge-animate", 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 
          "-=0.4"
        )
        .fromTo(".title-animate", 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 
          "-=0.3"
        )
        .fromTo(".desc-animate", 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 
          "-=0.3"
        );

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            if (videoRef.current) {
              try { videoRef.current.currentTime = 0; } catch(e) {}
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) playPromise.catch(() => {});
            }
          },
          onLeave: () => videoRef.current?.pause(),
          onEnterBack: () => {
            if (videoRef.current) {
              try { videoRef.current.currentTime = 0; } catch(e) {}
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) playPromise.catch(() => {});
            }
          },
          onLeaveBack: () => videoRef.current?.pause(),
        });
      }, sectionRef);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="screen-section">
      
      <div className="screen-glass-panel use-column-mobile" style={isMobile ? { flexDirection: 'column' } : {}}>



        {isMobile ? (
          <>
            <div 
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(243, 161, 82, 0.15)',
                border: '1px solid rgba(197, 163, 88, 0.4)',
                borderRadius: '999px',
                color: '#E6C274',
                fontFamily: "'Inter', sans-serif",
                fontSize: '0.85rem',
                fontWeight: '600',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                boxShadow: '0 0 20px rgba(197,163,88,0.15)',
                animation: 'pulseBadge 2s infinite ease-in-out',
                userSelect: 'none',
                zIndex: 10,
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E6C274', boxShadow: '0 0 12px #E6C274' }}></span>
              Navegación Inteligente
              <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '6px', borderLeft: '1px solid rgba(197, 163, 88, 0.3)', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                TOCA 
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </span>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(11, 13, 23, 0.85)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10000,
                  padding: '20px',
                  animation: 'fadeInModal 0.3s ease-out'
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: 'var(--via-bg)',
                    maxWidth: '450px',
                    width: '100%',
                    background: 'rgba(11, 13, 23, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                    padding: '36px 24px 28px',
                    borderRadius: '24px',
                    position: 'relative',
                    animation: 'slideUpModal 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    backdropFilter: 'blur(30px)',
                    WebkitBackdropFilter: 'blur(30px)',
                  }}
                >
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '50%',
                      color: '#FFF8E7',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '16px',
                    }}
                  >
                    &times;
                  </button>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: '#9C456E34',
                    border: '1px solid rgba(197, 163, 88, 0.3)',
                    borderRadius: '999px',
                    marginBottom: '1.25rem',
                    color: '#E6C274',
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E6C274' }}></span>
                    Navegación Inteligente
                  </div>

                  <h2 style={{ 
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    background: 'linear-gradient(135deg, var(--via-primary) 0%, #FFDF9D 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '1.8rem', 
                    marginBottom: '1rem', 
                    lineHeight: 1.2,
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    marginRight: '20px'
                  }}>
                    Llega Antes,<br/>Sin Estrés
                  </h2>

                  <p style={{ 
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '1rem', 
                    lineHeight: 1.6, 
                    color: 'rgba(247, 243, 235, 0.85)',
                    fontWeight: '400',
                    textAlign: 'justify'
                  }}>
                    Olvídate de las dudas. Ingresa tu destino y VIA trazará la ruta más rápida, estimando tu llegada con precisión y avisándote justo antes de tu parada.
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-content" ref={textRef} style={{ color: 'var(--via-bg)', flex: 1, maxWidth: '500px',background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.15)',padding:'5%',
            borderRadius:'clamp(14px, 4vw, 20px)'}}>
            
            {/* Glassmorphism Badge */}
            <div className="badge-animate" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: '#9C456E34',
              border: '1px solid rgba(197, 163, 88, 0.3)',
              borderRadius: '999px',
              marginBottom: '1.5rem',
              color: '#E6C274',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E6C274', boxShadow: '0 0 12px #E6C274' }}></span>
              Navegación Inteligente
            </div>

            <h2 className="title-animate" style={{ 
              fontFamily: "'Hanken Grotesk', sans-serif",
              background: 'linear-gradient(135deg, var(--via-primary) 0%, #FFDF9D 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 'clamp(1.65rem, 6vw, 3.25rem)', 
              marginBottom: '1.25rem', 
              lineHeight: 1.1,
              fontWeight: '800',
              letterSpacing: '-0.02em'
            }}>
              Llega Antes,<br/>Sin Estrés
            </h2>

            <p className="desc-animate" style={{ 
              fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(0.9rem, 3vw, 1.25rem)', 
              lineHeight: 1.6, 
              color: 'rgba(247, 243, 235, 0.85)',
              fontWeight: '400',
              textAlign:'justify'
            }}>
              Olvídate de las dudas. Ingresa tu destino y VIA trazará la ruta más rápida, estimando tu llegada con precisión y avisándote justo antes de tu parada.
            </p>

          </div>
        )}


        <div className="phone-animate" style={{ 
          flexShrink: 0, 
          filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.4))',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
          padding:'6px',
          borderRadius:'clamp(20px, 5vw, 28px)'
        }}>
          <PhoneMockup videoRef={videoRef} videoSrc={videoSrc} style={{ width: '260px' }} />
        </div>
      </div>

      <style>{`
        @keyframes pulseBadge {
          0% { transform: scale(1); opacity: 0.9; box-shadow: 0 0 15px rgba(197,163,88,0.15); }
          50% { transform: scale(1.03); opacity: 1; box-shadow: 0 0 25px rgba(197,163,88,0.35); }
          100% { transform: scale(1); opacity: 0.9; box-shadow: 0 0 15px rgba(197,163,88,0.15); }
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpModal {
          from { transform: translateY(30px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </section>
  );
}


