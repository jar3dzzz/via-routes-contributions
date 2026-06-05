import React, { useState } from 'react';

export function PhoneMockup({ videoRef, videoSrc }) {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  return (
    <div className="phone-shell" style={{ position: 'relative', width: 'clamp(180px, 55vw, 260px)', margin: '0 auto' }}>

      <div 
        className="phone-screen" 
        style={{  
          position: 'relative',
          top: '0', 
          left: '0', 
          width: '100%', 
          height: '100%', 
          zIndex: 5, 
          borderRadius: 'clamp(20px, 5vw, 32px)', 
          overflow: 'hidden',
          backgroundColor: '#0b0d17',
        }}
      >
        {/* Shimmering glassmorphic loading placeholder */}
        {isVideoLoading && (
          <div
            className="video-placeholder"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #0b0d17 0%, #151824 100%)',
              zIndex: 10,
              gap: '16px',
            }}
          >
            {/* Shimmer overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, rgba(244, 185, 95, 0.08) 50%, transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmerAnim 1.6s infinite',
                pointerEvents: 'none',
              }}
            />

            {/* Elegant glowing golden spinner */}
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: '3px solid rgba(244, 185, 95, 0.1)',
                borderTop: '3px solid #F4B95F',
                animation: 'spinLoader 0.8s linear infinite',
                boxShadow: '0 0 15px rgba(244, 185, 95, 0.25)',
              }}
            />

            {/* Pulsing loading text */}
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px',
                fontWeight: 600,
                color: 'rgba(255, 248, 231, 0.75)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                animation: 'pulseText 1.5s infinite ease-in-out',
                textShadow: '0 0 8px rgba(244, 185, 95, 0.15)',
              }}
            >
              Cargando
            </span>
          </div>
        )}

        <video 
          ref={videoRef}
          src={videoSrc}
          muted
          playsInline
          loop
          onLoadStart={() => setIsVideoLoading(true)}
          onWaiting={() => setIsVideoLoading(true)}
          onCanPlay={() => setIsVideoLoading(false)}
          onPlaying={() => setIsVideoLoading(false)}
          onLoadedData={() => setIsVideoLoading(false)}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>

      {/* Local keyframes style tag */}
      <style>{`
        @keyframes spinLoader {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmerAnim {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}