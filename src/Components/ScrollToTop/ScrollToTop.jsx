import React, { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const gameListBlocks = document.querySelector('section');
      if (gameListBlocks) {
        const rect = gameListBlocks.getBoundingClientRect();
        setIsVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    const gameListBlocks = document.querySelector('section');
    if (gameListBlocks) {
      gameListBlocks.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (window.triggerParticleRotationAnimation) {
      window.triggerParticleRotationAnimation();
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      ↑
    </button>
  );
}