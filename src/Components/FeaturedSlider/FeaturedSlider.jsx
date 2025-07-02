import { useEffect, useRef, useState, useMemo } from 'react';

const SLIDE_TIME = 7;
const TEXT_STYLES = {
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased'
};

const getGameStyles = (name) => {
  const lowerName = name.toLowerCase();
  return {
    font: lowerName.includes('minecraft') ? 'font-mono' :
          lowerName.includes('gta') ? 'font-bold' :
          lowerName.includes('fortnite') ? 'font-black' :
          lowerName.includes('valorant') ? 'font-semibold' : 'font-bold',
    stroke: lowerName.includes('minecraft') ? '1px #00ff00' :
            lowerName.includes('gta') ? '1px #ff6b00' :
            lowerName.includes('fortnite') ? '1px #9146ff' :
            lowerName.includes('valorant') ? '1px #ff4655' : '1px #ffffff'
  };
};

const FeaturedSlider = () => {
  const carouselRef = useRef(null);
  const [frontSlide, setFrontSlide] = useState(0);
  const rotationRef = useRef({ current: 0, target: 0 });
  const startTimeRef = useRef(Date.now());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeRef = useRef(0);

  const [gamesData, setGamesData] = useState(null);
  const items = useMemo(() => 
    gamesData?.games?.filter(game => game?.tag?.includes("Featured")) || [], [gamesData]
  );

  useEffect(() => {
    fetch('/gameLibrary/games.json')
      .then(response => response.json())
      .then(data => setGamesData(data))
      .catch(error => console.error('Error loading games:', error));
  }, []);

  const handleSlideClick = (slideIndex) => {
    if (slideIndex === frontSlide) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setFrontSlide(slideIndex);
      rotationRef.current.target = -slideIndex * (360 / items.length);
      startTimeRef.current = Date.now() - slideIndex * SLIDE_TIME * 1000;
      setIsTransitioning(false);
    }, 300);
  }; 

  useEffect(() => {
    if (items.length === 0) return;
    
    const animationDuration = SLIDE_TIME * items.length * 1000;
    let animationId;

    const animate = () => {
      try {
        const carousel = carouselRef.current;
        const carouselItems = carousel?.querySelectorAll('.carousel-item');
        if (!carousel || !carouselItems.length) return;

      const currentTime = Date.now();
      let currentSlide, timeInSlide;
      
      if (isPaused) {
        pauseTimeRef.current += 16;
      } else {
        const elapsed = ((currentTime - startTimeRef.current - pauseTimeRef.current) % animationDuration) / 1000;
        currentSlide = Math.floor(elapsed / SLIDE_TIME) % items.length;
        timeInSlide = elapsed % SLIDE_TIME;
        
        if (currentSlide !== frontSlide) {
          setFrontSlide(currentSlide);
          rotationRef.current.target = -currentSlide * (360 / items.length);
        }
      }

      rotationRef.current.current += (rotationRef.current.target - rotationRef.current.current) * 0.1;
      carousel.style.transform = `rotateY(${rotationRef.current.current}deg)`;

      carouselItems.forEach((item, index) => {
        const rotationAngle = index * (360 / items.length);
        let scale = 1;
        if (isTransitioning) {
          scale = index === frontSlide ? 0.8 : 1;
        } else {
          scale = index === frontSlide && (isPaused || (timeInSlide > 1 && timeInSlide < 6)) ? 1.5 : 1;
        }
        item.style.transform = `rotateY(${rotationAngle}deg) translateZ(500px) scale(${scale})`;
      });

        animationId = requestAnimationFrame(animate);
      } catch (error) {
        console.warn('Animation error:', error);
      }
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [items.length, frontSlide, isTransitioning, isPaused]);

  if (items.length === 0) {
    return <div className="flex justify-center items-center min-h-screen font-inter">No featured games found.</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen font-inter relative">
      <div 
        className="w-[300px] h-[160px]"
        style={{ perspective: '1000px' }}
      >
        <div 
          ref={carouselRef}
          className="w-full h-full relative"
          style={{ 
            transformStyle: 'preserve-3d'
          }}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={`carousel-item absolute w-[300px] h-[160px] backdrop-blur-[10px] border border-white/18 shadow-[0_0px_20px_10px_rgba(0,0,0)] transition-transform duration-300 origin-center ${index === frontSlide ? 'cursor-pointer group' : ''}`}
              onMouseEnter={() => index === frontSlide && setIsPaused(true)}
              onMouseLeave={() => index === frontSlide && setIsPaused(false)}
              style={{
                transform: `rotateY(${index * (360 / items.length)}deg) translateZ(500px)`,
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
            >
              <img 
                src={item.src}
                alt={item.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${index === frontSlide ? 'group-hover:blur-sm' : ''}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 text-white" style={{ transform: 'translateZ(0)' }}>
                <h3 
                  className={`absolute bottom-0 left-0 right-0 text-xl text-center p-4 transition-all duration-300 ${getGameStyles(item.name).font} ${index === frontSlide ? 'group-hover:top-0 group-hover:left-0 group-hover:right-auto group-hover:bottom-auto group-hover:text-left group-hover:p-2' : ''}`}
                  style={{ 
                    ...TEXT_STYLES,
                    WebkitTextStroke: getGameStyles(item.name).stroke
                  }}
                >
                  {item.name.split('').map((letter, i) => (
                    <span 
                      key={i} 
                      className={`inline-block ${index === frontSlide ? 'group-hover:animate-bounce' : ''}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </span>
                  ))}
                </h3>
                <p className={`text-sm line-clamp-2 text-center opacity-0 transition-opacity duration-300 absolute top-8 left-2 right-2 ${index === frontSlide ? 'group-hover:opacity-100' : ''}`} style={TEXT_STYLES}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === frontSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedSlider;

