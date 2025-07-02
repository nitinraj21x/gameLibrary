import { useEffect, useRef, useState } from 'react';

// GameCard component to display individual game details
const GameCard = ({ game }) => {
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [currentShape, setCurrentShape] = useState(0);
    const [closeClicked, setCloseClicked] = useState(false);
    const [animationType] = useState(() => Math.floor(Math.random() * 5));
    
    const shapes = [
        '50%', // Circle
        '0%', // Square
        '25%', // Rounded square
        '50% 0%', // Half circle
        '0% 50%', // Quarter rounded
        '10px', // Small rounded corners
        '50% 50% 0% 0%' // Top rounded
    ];
    
    const colors = [
        'from-blue-400 to-blue-600',
        'from-green-400 to-green-600',
        'from-purple-400 to-purple-600',
        'from-red-400 to-red-600',
        'from-yellow-400 to-yellow-600',
        'from-pink-400 to-pink-600',
        'from-indigo-400 to-indigo-600'
    ];
    
    const tagColors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-red-500',
        'bg-yellow-500',
        'bg-pink-500',
        'bg-indigo-500'
    ];
    
    // Fallback image URL in case the provided 'src' is invalid or missing
    const fallbackImageUrl = `https://placehold.co/300x200/cccccc/000000?text=${encodeURIComponent(game.name)}`;

    const getAnimationStyles = (isIn) => {
        const animations = [
            // Slide from bottom with rotation
            {
                in: 'translateY(0) rotateX(0) scale(1)',
                out: 'translateY(80px) rotateX(-20deg) scale(0.8)'
            },
            // Slide from left with tilt
            {
                in: 'translateX(0) rotateY(0) scale(1)',
                out: 'translateX(-100px) rotateY(25deg) scale(0.7)'
            },
            // Slide from right with flip
            {
                in: 'translateX(0) rotateZ(0) scale(1)',
                out: 'translateX(100px) rotateZ(-15deg) scale(0.9)'
            },
            // Zoom with 3D rotation
            {
                in: 'scale(1) rotateX(0) rotateY(0)',
                out: 'scale(0.3) rotateX(45deg) rotateY(45deg)'
            },
            // Diagonal slide with twist
            {
                in: 'translate(0, 0) rotateZ(0) scale(1)',
                out: 'translate(-60px, 60px) rotateZ(20deg) scale(0.6)'
            }
        ];
        return animations[animationType][isIn ? 'in' : 'out'];
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (cardRef.current) {
                        cardRef.current.style.transform = getAnimationStyles(true);
                        cardRef.current.style.opacity = '1';
                    }
                } else {
                    setIsVisible(false);
                    if (cardRef.current) {
                        cardRef.current.style.transform = getAnimationStyles(false);
                        cardRef.current.style.opacity = '0.2';
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [animationType]);

    return (
        <>
        <div 
            ref={cardRef}
            className="gameBox rounded-lg shadow-lg overflow-hidden transform transition-all duration-700 ease-out hover:scale-105 relative cursor-pointer"
            style={{
                transform: getAnimationStyles(false),
                opacity: '0.2',
                transformStyle: 'preserve-3d',
                aspectRatio: '5/3'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setShowPopup(true)}
        >
            <img
                src={game.src}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = fallbackImageUrl;
                }}
            />
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-2 sm:p-4">
                <h3 
                    className="text-xs sm:text-xl font-bold text-center mb-1 sm:mb-2" 
                    style={{
                        fontFamily: 'Orbitron, monospace',
                        color: '#00ff88',
                        textShadow: isHovered ? 
                            '0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88, 2px 2px 0px #004d2a, 4px 4px 0px #003d21, 6px 6px 0px #002d18, 8px 8px 15px rgba(0,0,0,0.8)' : 
                            '1px 1px 0px #004d2a, 2px 2px 0px #003d21, 3px 3px 5px rgba(0,0,0,0.8)',
                        WebkitTextStroke: isHovered ? '1px #ffffff' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {game.name}
                </h3>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1 sm:p-4 hidden sm:block">
                <div className="flex flex-wrap gap-1">
                    {game.tag.map((tag, index) => (
                        <span 
                            key={index} 
                            className="bg-gray-900 text-lime-400 text-xs font-medium px-2 py-1 rounded-full overflow-hidden whitespace-nowrap"
                            style={{
                                maxWidth: isHovered ? '200px' : '64px',
                                transition: 'max-width 1s ease-in-out',
                                textOverflow: isHovered ? 'clip' : 'ellipsis'
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Popup Modal */}
        {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setShowPopup(false)}>
                <div className="bg-gray-900 rounded-xl max-w-4xl w-full mx-2 sm:mx-4 flex flex-col sm:flex-row overflow-hidden relative border-2 border-cyan-500 shadow-2xl shadow-cyan-500/20 max-h-[90vh] sm:max-h-none" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => {
                            setCloseClicked(true);
                            setTimeout(() => setShowPopup(false), 200);
                        }} 
                        className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-gray-800 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-cyan-500 hover:bg-gray-700 transition-all duration-300 touch-manipulation ${closeClicked ? 'animate-close-click' : 'animate-close-float'}`}
                    >
                        <div className={`relative w-4 h-4 ${closeClicked ? 'animate-lines-spin' : ''}`}>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 transform -translate-y-1/2 rotate-45"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400 transform -translate-y-1/2 -rotate-45"></div>
                        </div>
                    </button>
                    <img src={game.altSrc} alt={game.name} className="w-full sm:w-1/2 h-48 sm:h-96 object-cover border-b sm:border-b-0 sm:border-r border-cyan-500" onError={(e) => { e.target.src = fallbackImageUrl; }} />
                    <div className="w-full sm:w-1/2 p-4 sm:p-6 relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-y-auto">
                        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-cyan-300 text-shadow-glow">{game.name}</h2>
                        <div className="mb-3 sm:mb-4">
                            {game.tag.map((tag, index) => (
                                <span key={index} className={`${tagColors[currentShape]} text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full mr-1 sm:mr-2 mb-1 sm:mb-2 inline-block transition-colors duration-500 border border-white/20 shadow-lg`}>{tag}</span>
                            ))}
                        </div>
                        <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-12 sm:mb-0">{game.description || 'No description available.'}</p>
                        <button 
                            className={`absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${colors[currentShape]} text-white flex items-center justify-center transition-all duration-500 hover:scale-110 touch-manipulation ${isClicked ? 'animate-splash' : ''}`}
                            style={{
                                borderRadius: shapes[currentShape],
                                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                                transform: isClicked ? 'translate(-50%, 0) scale(1.3)' : 'translate(-50%, 0) scale(1)',
                                transition: 'all 0.3s ease-out'
                            }}
                            onClick={() => {
                                setIsClicked(true);
                                setCurrentShape((prev) => (prev + 1) % shapes.length);
                                setTimeout(() => setIsClicked(false), 300);
                            }}
                        >
                            <svg width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        </button>
                        <style jsx>{`
                            @keyframes splash {
                                0% { transform: translate(-50%, 0) scale(1); }
                                50% { transform: translate(-50%, 0) scale(1.4); }
                                100% { transform: translate(-50%, 0) scale(1.1); }
                            }
                            .animate-splash {
                                animation: splash 0.3s ease-out;
                            }
                            .text-shadow-glow {
                                text-shadow: 0 0 10px rgba(103, 232, 249, 0.5), 0 0 20px rgba(103, 232, 249, 0.3);
                            }
                            @keyframes closeFloat {
                                0%, 100% { transform: translateY(0px) rotate(0deg); }
                                50% { transform: translateY(-2px) rotate(2deg); }
                            }
                            @keyframes closeClick {
                                0% { transform: scale(1); }
                                50% { transform: scale(0.9); }
                                100% { transform: scale(1.1); }
                            }
                            @keyframes linesSpin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(180deg); }
                            }
                            .animate-close-float {
                                animation: closeFloat 2s ease-in-out infinite;
                            }
                            .animate-close-click {
                                animation: closeClick 0.2s ease-out;
                            }
                            .animate-lines-spin {
                                animation: linesSpin 0.3s ease-out;
                            }
                        `}</style>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default GameCard