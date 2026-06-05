import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const villaPicture = '/villaPicture.png';


gsap.registerPlugin(ScrollTrigger);

export function HomeScreen({ activeIndex = 0 }) {
  const sectionRef = useRef(null); 
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);
  const glowRef = useRef(null);
  const raysRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

// Screen 1: Golden Hour / Late Afternoon (Your original)
const sunset1 = 'linear-gradient(180deg, #FFF2C8 0%, #F4B95F 20%, #E8863A 50%, #FFF2C8 70%, #FAD98A 80%, #FFF2C8 100%)';

// Screen 2: Dusk / Deepening Orange & Pink
const sunset2 = 'linear-gradient(180deg, #F3A152 0%, #E2693D 20%, #A23A4E 50%, #F4A15D 70%, #E88352 80%, #F3A152 100%)';

// Screen 3: Twilight / The Blue Hour Begins
const sunset3 = 'linear-gradient(180deg, #9C456E 0%, #643168 20%, #2E224F 50%, #B75276 70%, #873B66 80%, #9C456E 100%)';

// Screen 4: Nightfall / Deep Indigo & Violet
const sunset4 = 'linear-gradient(180deg, #3C2A58 0%, #1F1A3A 20%, #0F0C1B 50%, #4D3466 70%, #2D2249 80%, #3C2A58 100%)';

// Screen 5: Midnight / Clear Night Sky
const sunset5 = 'linear-gradient(180deg, #161224 0%, #0B0914 20%, #030206 50%, #231C35 70%, #120E1E 80%, #161224 100%)';

  useEffect(() => {

    let ctx;
    const timer = setTimeout(() => {
      if (!titleRef.current || !subtitleRef.current) return;

      ctx = gsap.context(() => {
        // Title "via" grows from tiny to full size like the sun rising
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
          titleRef.current,
          { scale: 0.1, opacity: 0, filter: 'blur(20px)' },
          { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 2 }
        );

        // Glow intensifies as the sun grows
        tl.fromTo(
          glowRef.current,
          { scale: 0.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2 },
          0
        );

        // Sun rays appear
        tl.fromTo(
          raysRef.current,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 0.6, duration: 2.5 },
          0.3
        );

        // Subtitle fades in after the sun has appeared
        tl.fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2 },
          1.2
        );

        // Button fades in after the subtitle
        tl.fromTo(
          btnRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1 },
          1.6
        );



        // Scroll indicator fades in gently
        tl.fromTo(
          scrollIndicatorRef.current,
          { y: 15, opacity: 0 },
          { y: 0, opacity: 0.7, duration: 1 },
          2.3
        );

        // Gentle continuous pulse on the glow
        gsap.to(glowRef.current, {
          scale: 1.08,
          opacity: 0.85,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });

        // Breathing animation for the "VIA" title itself
        gsap.to(titleRef.current, {
          scale: 1.03,
          textShadow: '0 0 80px rgba(255,242,200,0.9), 0 0 140px rgba(244,185,95,0.6), 0 0 220px rgba(232,134,58,0.4)',
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 2 // Start after the entrance animation finishes
        });

        // Slow rotation on the rays
        gsap.to(raysRef.current, {
          rotation: 360,
          duration: 120,
          repeat: -1,
          ease: 'none',
        });

      });
    }, 50);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, []);

  // Listen to screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);




  return (
    <section
      ref={sectionRef}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'transparent', // The background will be handled by the layered divs below
      }}
    >

      {/* Layered Crossfading Backgrounds */}
      {[sunset1, sunset2, sunset3, sunset4, sunset5].map((bg, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            inset: 0,
            background: bg,
            opacity: activeIndex === idx ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Villahermosa City Skyline Background with Horizon Mask Effect & Infinite Parallax Pan */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          backgroundImage: `url(${villaPicture})`,
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          backgroundPosition: '0px bottom',
          opacity: 0.32,
          mixBlendMode: 'luminosity',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'infinitePan 120s linear infinite',
        }}
      />


      {/* Top darkness gradient for immersive sky */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '35%',
          background: 'linear-gradient(180deg, rgba(11,13,23,0.9) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Bottom darkness gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20%',
          background: 'linear-gradient(0deg, rgba(11,13,23,0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Sun rays (rotating conic gradient behind the title) 
      <div
        ref={raysRef}
        style={{
          position: 'absolute',
          width: '120vmax',
          height: '120vmax',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(250,217,138,0.15) 10deg, transparent 20deg, transparent 30deg, rgba(250,217,138,0.1) 40deg, transparent 50deg, transparent 60deg, rgba(250,217,138,0.12) 70deg, transparent 80deg, transparent 90deg, rgba(250,217,138,0.15) 100deg, transparent 110deg, transparent 120deg, rgba(250,217,138,0.1) 130deg, transparent 140deg, transparent 150deg, rgba(250,217,138,0.12) 160deg, transparent 170deg, transparent 180deg, rgba(250,217,138,0.15) 190deg, transparent 200deg, transparent 210deg, rgba(250,217,138,0.1) 220deg, transparent 230deg, transparent 240deg, rgba(250,217,138,0.12) 250deg, transparent 260deg, transparent 270deg, rgba(250,217,138,0.15) 280deg, transparent 290deg, transparent 300deg, rgba(250,217,138,0.1) 310deg, transparent 320deg, transparent 330deg, rgba(250,217,138,0.12) 340deg, transparent 350deg, transparent 360deg)',
          borderRadius: '50%',
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />*/}

      {/* Warm radial glow behind the title — the sun's aura */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          width: '60vmin',
          height: '60vmin',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 217, 93, 0.8) 0%, rgba(244,185,95,0.5) 25%, rgba(105, 50, 8, 0.3) 45%, rgba(197,83,62,0.15) 65%, transparent 85%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 3,
        }}
      />

      {activeIndex == 4&& (
        <p
        ref={subtitleRef}
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
          maxWidth: '600px',
          margin: '1.5rem auto 0',
          color: '#777',
          padding: '0 20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 5,
          fontWeight: 300,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
          textShadow: '0 2px 20px rgba(0,0,0,0.4)',
        }}
      >
        ¿Quieres formar parte?
      </p>
      )}


      {/* Title "via" — the sun itself */}
      <h1
        ref={titleRef}
        style={{
          fontSize: 'clamp(80px, 20vw, 240px)',
          fontWeight: 800,
          margin: 0,
          color: '#FFF8E7',
          letterSpacing: '-0.04em',
          lineHeight: 1,

          position: 'relative',
          zIndex: 5,
          textShadow: '0 0 60px rgba(255,242,200,0.8), 0 0 120px rgba(244,185,95,0.5), 0 0 200px rgba(232,134,58,0.3)',
          opacity: 0,
          fontFamily: "'Yeseva One', serif",
        }}
      >
        VIA
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.6rem)',
          maxWidth: '600px',
          margin: '1.5rem auto 0',
          color: '#777',
          padding: '0 20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 5,
          fontWeight: 300,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: 0,                                              // GSAP animates this to 1
          visibility: activeIndex === 0 ? 'visible' : 'hidden',   // show/hide without unmounting
          pointerEvents: activeIndex === 0 ? 'auto' : 'none', 
          fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
          textShadow: '0 2px 20px rgba(0,0,0,0.4)',
        }}
      >
        Encuentra donde y cómo ir 
      </p>

      {/* contact */}
      {activeIndex === 4 && (
        
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            marginTop: '2.5rem',
            padding: '12px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '30px',
            color: '#fff5f5ff',
            fontSize: '1.2rem',
            fontWeight: 600,
            cursor: 'pointer',
            position: 'relative',
            zIndex: 5,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            fontFamily: "'Inter', system-ui, sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
          }}
        >
          <span style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection:'row',alignItems: 'center', gap: '8px' }}>
            Contactanos
          </span>
        </button>
      )}


{/* Descargar Button with Android Icon */}

      <button
        ref={btnRef}
        style={{
          marginTop: '2.5rem',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          backgroundColor: 'rgba(241, 134, 40, 1)',
          border: '1px solid rgba(231, 142, 53, 0.99)',
          borderRadius: '30px',
          color: '#ffffffff',
          fontSize: '1.2rem',
          fontWeight: 600,
          cursor: 'pointer',
          position: 'relative',
          zIndex: 5,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(255, 102, 0, 0.2)',
          transition: 'all 0.3s ease',
          opacity: 0,                                              // GSAP animates this to 1
          visibility: activeIndex === 0 ? 'visible' : 'hidden',   // show/hide without unmounting
          pointerEvents: activeIndex === 0 ? 'auto' : 'none', 
          fontFamily: "'Inter', system-ui, sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        }}
      >
        <a href="https://play.google.com/store/apps/details?id=com.hir4m.hirashi" target="_blank" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection:'row',alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#A4C639" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414C17.523 15.3414 17.523 15.3414 17.523 15.3414ZM6.477 15.3414C6.477 15.3414 6.477 15.3414 6.477 15.3414C6.477 15.3414 6.477 15.3414 6.477 15.3414C6.477 15.3414 6.477 15.3414 6.477 15.3414ZM17.1643 7.82281L19.2618 4.19531C19.3364 4.06687 19.2941 3.89906 19.1656 3.82453C19.0371 3.75 18.8693 3.79234 18.7947 3.92078L16.6661 7.60359C15.2631 6.96344 13.6844 6.59109 12.0003 6.59109C10.3161 6.59109 8.73748 6.96344 7.33446 7.60359L5.20583 3.92078C5.13129 3.79234 4.96348 3.75 4.83498 3.82453C4.70648 3.89906 4.66414 4.06687 4.73867 4.19531L6.83614 7.82281C3.01161 9.92344 0.443359 13.9181 0.443359 18.6014H23.5572C23.5572 13.9181 20.9889 9.92344 17.1643 7.82281ZM6.477 16.3687C5.90802 16.3687 5.44752 15.9083 5.44752 15.3394C5.44752 14.7704 5.90802 14.31 6.477 14.31C7.04598 14.31 7.50648 14.7704 7.50648 15.3394C7.50648 15.9083 7.04598 16.3687 6.477 16.3687ZM17.523 16.3687C16.954 16.3687 16.4935 15.9083 16.4935 15.3394C16.4935 14.7704 16.954 14.31 17.523 14.31C18.092 14.31 18.5525 14.7704 18.5525 15.3394C18.5525 15.9083 18.092 16.3687 17.523 16.3687Z" />
          </svg>
          Descargar
        </a>
      </button>

      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorRef}
        style={{
          position: 'absolute',
          bottom: '3vh',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 5,
          opacity: 0, // GSAP animates this to 0.7
          visibility: activeIndex === 0 ? 'visible' : 'hidden',
          pointerEvents: activeIndex === 0 ? 'auto' : 'none',
          transition: 'opacity 0.5s ease',
        }}
      >
        <span style={{
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '0.65rem',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: 'rgba(255, 255, 255, 1)',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          marginBottom: '4px',
          textAlign:'center'
        }}>
          Desliza para conocer más
        </span>
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
      </div>


      {/* Tiny stars scattered in the upper sky area */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const top = Math.random() * 40;
          const left = Math.random() * 100;
          const size = Math.random() * 2 + 1;
          const delay = Math.random() * 5;
          const dur = Math.random() * 3 + 2;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.7)',
                animation: `starTwinkle ${dur}s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          );
        })}
      </div>

      {/* Horizon line glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '28%',
          left: '-10%',
          right: '-10%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(250,217,138,0.3), rgba(255,242,200,0.5), rgba(250,217,138,0.3), transparent)',
          filter: 'blur(1px)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              maxWidth: '90%',
              width: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ 
              color: '#ccc', 
              fontFamily: "'Inter', system-ui, sans-serif", 
              margin: '0 0 24px 0',
              fontSize: '1.1rem',
              fontWeight: 300
            }}>
              Envíanos un correo a:
            </p>
            <a 
              href="mailto:decoherencecontacts@gmail.com"
              style={{
                color: '#F4B95F',
                textDecoration: 'none',
                fontSize: '1rem',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontWeight: 500,
                display: 'block',
                marginBottom: '32px',
                wordBreak: 'break-all'
              }}
            >
              decoherencecontacts@gmail.com
            </a>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                padding: '10px 32px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '30px',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* CSS animations injected via style tag */}
      <style>{`
        @keyframes starTwinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes infinitePan {
          from { background-position-x: 0px; }
          to { background-position-x: -2000px; }
        }

        .scroll-mouse {
          width: 20px;
          height: 32px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          position: relative;
          margin-top: 4px;
          opacity: 0.8;
        }
        .scroll-wheel {
          width: 4px;
          height: 6px;
          background-color: #F4B95F;
          border-radius: 2px;
          position: absolute;
          left: 50%;
          top: 6px;
          transform: translateX(-50%);
          animation: scrollWheelAnim 1.8s ease-in-out infinite;
        }
        @keyframes scrollWheelAnim {
          0% { top: 6px; opacity: 0; }
          20% { opacity: 1; }
          80% { top: 18px; opacity: 0; }
          100% { top: 18px; opacity: 0; }
        }
      `}</style>

    </section>
  );
}