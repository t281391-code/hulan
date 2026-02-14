import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import SolarSystem from './SolarSystem';
import tsengelImage from '../assets/tsengel.jpg';
import musicFile from '../sound/thunderz-tengri-jureem-official-music-video_HHDdgD0V.mp3';

const SolarLanding = () => {
  const [showValentine, setShowValentine] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleEarthClick = () => {
    setShowValentine(true);
  };

  const handleCloseValentine = () => {
    setShowValentine(false);
    setHearts([]);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
        });
        setIsPlaying(true);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleMouseMove = (e) => {
    if (!showValentine) return;
    
    // Throttle heart creation for better performance
    const now = Date.now();
    if (handleMouseMove.lastTime && now - handleMouseMove.lastTime < 100) {
      return;
    }
    handleMouseMove.lastTime = now;
    
    const heartEmojis = ['💖', '💕', '💗', '💝', '❤️', '💓', '💞', '💟'];
    const randomHeart = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    
    // Support both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;
    
    const newHeart = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY,
      emoji: randomHeart,
    };
    
    setHearts((prev) => [...prev, newHeart]);
    
    // Remove heart after animation completes
    setTimeout(() => {
      setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
    }, 2000);
  };

  // Responsive camera position
  const getCameraPosition = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) {
        return [0, 12, 20]; // Mobile: closer
      } else if (width < 1024) {
        return [0, 14, 22]; // Tablet: medium
      }
      return [0, 15, 25]; // Desktop: default
    }
    return [0, 15, 25];
  };

  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <Canvas camera={{ position: getCameraPosition(), fov: 60 }}>
        <Suspense fallback={null}>
          <SolarSystem onEarthClick={handleEarthClick} />
        </Suspense>
      </Canvas>

      {/* Overlay instructions */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center sm:justify-end pb-0 sm:pb-8 md:pb-12 lg:pb-16">
        <div className="bg-black/95 backdrop-blur-md border-[3px] sm:border-2 border-orange-500 px-6 sm:px-6 md:px-8 lg:px-10 py-5 sm:py-4 md:py-5 lg:py-6 rounded-xl sm:rounded-xl shadow-2xl mx-4 sm:mx-4 md:mx-6 sm:animate-pulse w-[95%] sm:w-auto max-w-md" style={{ filter: 'blur(0px)' }}>
          <div className="text-orange-400 sm:text-orange-500 text-3xl sm:text-xl md:text-2xl lg:text-3xl font-bold font-mono tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.3em] text-center leading-tight blur-[10px] sm:blur-0" style={{ textShadow: '0 0 20px rgba(251, 146, 60, 1), 0 0 40px rgba(251, 146, 60, 0.8), 0 0 60px rgba(251, 146, 60, 0.6)' }}>
            <span className="block sm:hidden">Татаад дэлхий дээр дар</span>
            <span className="hidden sm:block uppercase">ДЭЛХИЙ ДЭЭР ДАР</span>
          </div>
        </div>
      </div>

      {/* Valentine's Day Greeting Modal */}
      {showValentine && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleCloseValentine}
          onMouseMove={handleMouseMove}
          onTouchMove={handleMouseMove}
        >
          <div 
            className="relative bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-4 border-2 border-pink-500/50 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleCloseValentine}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white/70 hover:text-white text-xl sm:text-2xl transition-colors z-10"
            >
              ×
            </button>

            {/* Image */}
            <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
              <div className="relative">
                <img 
                  src={tsengelImage} 
                  alt="Цэнгэл" 
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-full border-2 sm:border-2 md:border-4 border-pink-400 shadow-lg"
                />
                <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-500 text-white px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold">
                  Цэнгэл
                </div>
              </div>
            </div>

            {/* Greeting Message */}
            <div className="text-center space-y-2 sm:space-y-3 md:space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                <span className="text-2xl sm:text-3xl md:text-4xl">💕</span> Valentine's Day <span className="text-2xl sm:text-3xl md:text-4xl">💕</span>
              </h2>
              <p className="text-lg sm:text-xl text-pink-200 font-semibold">
                
              </p>
              <p className="text-base sm:text-base md:text-lg text-white/90 leading-relaxed px-2 sm:px-0">
               Валентины баярын мэнд хүргэе! 
                 <br className="sm:hidden" />
                 <span className="text-2xl sm:text-xl md:text-2xl inline-block mt-1 sm:mt-0">💖</span>
              </p>
              <div className="pt-2 sm:pt-3 md:pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
                <button
                  onClick={toggleMusic}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 sm:py-2.5 sm:px-7 md:py-3 md:px-8 rounded-full transition-colors shadow-lg transform hover:scale-105 text-sm sm:text-base flex items-center gap-2"
                >
                  {isPlaying ? (
                    <>
                      <span>⏸️</span>
                      <span>Дуу зогсоох</span>
                    </>
                  ) : (
                    <>
                      <span>▶️</span>
                      <span>Дуу тоглуулах</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleCloseValentine}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 sm:py-2.5 sm:px-7 md:py-3 md:px-8 rounded-full transition-colors shadow-lg transform hover:scale-105 text-sm sm:text-base"
                >
                  Арилгах
                </button>
              </div>
            </div>

            {/* Decorative hearts - hidden on small screens */}
            <div className="hidden sm:block absolute top-2 left-2 text-pink-400 text-xl sm:text-2xl animate-pulse">💖</div>
            <div className="hidden sm:block absolute top-4 right-8 text-red-400 text-lg sm:text-xl animate-pulse delay-75">💕</div>
            <div className="hidden sm:block absolute bottom-4 left-4 text-pink-300 text-lg sm:text-xl animate-pulse delay-150">💗</div>
            <div className="hidden sm:block absolute bottom-2 right-2 text-red-300 text-xl sm:text-2xl animate-pulse delay-200">💝</div>
          </div>
          
          {/* Floating hearts from cursor */}
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="fixed pointer-events-none z-50 text-2xl sm:text-3xl animate-heart-float"
              style={{
                left: `${heart.x}px`,
                top: `${heart.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {heart.emoji}
            </div>
          ))}
        </div>
      )}
      
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={musicFile}
        loop
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  );
};

export default SolarLanding;

