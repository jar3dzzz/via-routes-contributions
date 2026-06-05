import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const viaIcon = '/icon.png';
  
export function AboutUsScreen() {
  const [isMobile, setIsMobile] = useState(false);
const navigate = useNavigate();
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sunsetBg = 'linear-gradient(180deg, #3C2A58 0%, #1F1A3A 40%, #0F0C1B 100%)';

  return (
    <section
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: sunsetBg,
        padding: isMobile ? '100px 20px 60px' : '120px 48px 80px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top darkness gradient for immersive sky */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '25%',
          background: 'linear-gradient(180deg, rgba(11,13,23,0.9) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Tiny stars scattered in the sky */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        {Array.from({ length: 30 }).map((_, i) => {
          const top = Math.random() * 50;
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
                backgroundColor: 'rgba(255,255,255,0.6)',
                animation: `starTwinkle ${dur}s ease-in-out ${delay}s infinite alternate`,
              }}
            />
          );
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '40px' : '80px',
          maxWidth: '1100px',
          width: '100%',
          zIndex: 5,
        }}
      >
        {/* Left column: Text content */}
        <div
          style={{
            flex: 1,
            color: '#FFF8E7',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(244, 185, 95, 0.12)',
              border: '1px solid rgba(244, 185, 95, 0.25)',
              borderRadius: '999px',
              marginBottom: '1.5rem',
              color: '#F4B95F',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Sobre Nosotros
          </div>

          <h1
            style={{
              fontFamily: "'Yeseva One', serif",
              fontSize: isMobile ? '2.4rem' : '4rem',
              fontWeight: 800,
              margin: '0 0 20px 0',
              lineHeight: 1.15,
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            El Futuro de la Movilidad nace en Tabasco
          </h1>

          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: isMobile ? '1rem' : '1.15rem',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.7,
              margin: '0 0 24px 0',
              textAlign: 'justify',
            }}
          >
            Via es una aplicación creada 100% por tabasqueños, con la intencion de mejorar la experiencia de los usuarios del transporte público y diseñada pensando específicamente en tus necesidades de movilidad.
          </p>
          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: isMobile ? '1rem' : '1.15rem',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.7,
              margin: '0 0 24px 0',
              textAlign: 'justify',
            }}
          >
          </p>

          <p
            style={{
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: isMobile ? '1rem' : '1.15rem',
              fontWeight: 300,
              color: 'rgba(255, 255, 255, 0.8)',
              lineHeight: 1.7,
              margin: 0,
              textAlign: 'justify',
            }}
          >
            Nuestra visión es eliminar la incertidumbre del transporte urbano mediante tecnología de punta, permitiéndote tomar el control total de tu tiempo y moverte de forma segura y eficiente por la ciudad.
          </p>
        </div>

        {/* Right column: Graphic glass panel */}
        <div onClick={() => {navigate('/maping') }}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '32px',
              padding: isMobile ? '30px 20px' : '48px 40px',
              width: '100%',
              maxWidth: '450px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            {/* Spinning Radar Circle */}
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px dashed rgba(244, 185, 95, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'spinAbout 18s linear infinite',
              }}
            >
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(241, 134, 40, 0.2) 0%, rgba(244, 185, 95, 0.2) 100%)',
                  border: '1px solid rgba(244, 185, 95, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(244, 185, 95, 0.2)',
                  animation: 'pulseGlow 3s infinite ease-in-out',
                }}
                
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F4B95F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'keepStillAbout 18s linear infinite' }}>
                  <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                  <line x1="8" y1="2" x2="8" y2="18" />
                  <line x1="16" y1="6" x2="16" y2="22" />
                </svg>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '1.4rem', color: '#FFF8E7', margin: '0 0 8px 0', fontWeight: 700 }}>
                Descubre cómo
                
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>
                ¿Quieres ayudar a mapear y mejorar la experiencia del transporte público en Villahermosa, Tabasco? 
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        @keyframes starTwinkle {
          0% { opacity: 0.2; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes spinAbout {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes keepStillAbout {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes pulseGlow {
          0% { transform: scale(1); box-shadow: 0 0 30px rgba(244, 185, 95, 0.2); }
          50% { transform: scale(1.05); box-shadow: 0 0 45px rgba(244, 185, 95, 0.4); }
          100% { transform: scale(1); box-shadow: 0 0 30px rgba(244, 185, 95, 0.2); }
        }
      `}</style>
    </section>
  );
}
