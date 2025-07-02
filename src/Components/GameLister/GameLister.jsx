import { useState, useEffect, useRef } from 'react';
import GameCard from "./GameCard.jsx";

const MobileSlider = ({ games }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 3) % games.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [games.length]);
    
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            setCurrentIndex(prev => diff > 0 ? (prev + 3) % games.length : (prev - 3 + games.length) % games.length);
        }
    };
    
    const visibleGames = games.slice(currentIndex, currentIndex + 3).concat(
        currentIndex + 3 > games.length ? games.slice(0, (currentIndex + 3) % games.length) : []
    );
    
    return (
        <div 
            className="flex gap-2 px-2"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {visibleGames.map((game, index) => (
                <div key={`${currentIndex}-${index}`} className="w-1/3">
                    <GameCard game={game} />
                </div>
            ))}
        </div>
    );
};

const GameLister = () => {
    const [jsonData, setJsonData] = useState(null);
    
    useEffect(() => {
        fetch('/gameLibrary/games.json')
            .then(response => response.json())
            .then(data => setJsonData(data))
            .catch(error => console.error('Error loading games:', error));
    }, []);
    
    if (!jsonData) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading games...</div>;
    }
    
    // Extract all games
    const allGames = jsonData.games;

    // Get unique tags and organize games by tag
    const gamesByTag = allGames.reduce((acc, game) => {
        game.tag.forEach(tag => {
            if (!acc[tag]) {
                acc[tag] = [];
            }
            acc[tag].push(game);
        });
        return acc;
    }, {});

    // Get sorted unique tags
    const uniqueTags = Object.keys(gamesByTag).sort();
    return (
        <div className="min-h-screen text-white font-sans p-3 sm:p-6 lg:p-10">
        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-gaming font-black text-center mb-8 sm:mb-12 drop-shadow-lg game-library-text">
            Our Game Collection
        </h1>

        {/* All Games Section */}
        <section className="mb-12 sm:mb-16">
            <div className="gListerContainer">                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-gaming font-black text-center mb-6 sm:mb-10 border-b-2 sm:border-b-4 border-blue-500 pb-2 sm:pb-3 game-library-text">
                    ALL Games
                </h2>
                <div className="block sm:hidden">
                    {allGames.length > 0 && <MobileSlider games={allGames} />}
                </div>
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mx-4 lg:mx-[15%]">
                    {allGames.map((game, index) => (
                        <GameCard key={index} game={game} />
                    ))}
                </div>
            </div>
        </section>

        {/* Sections by Tag */}
        {uniqueTags.map(tag => (
            <section key={tag} id={`genre-${tag.toLowerCase()}`} className="mb-12 sm:mb-16">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-gaming font-black text-center mb-6 sm:mb-10 border-b-2 sm:border-b-4 border-blue-500 pb-2 sm:pb-3 capitalize game-library-text">
                    {tag} Games
                </h2>
                <div className="block sm:hidden">
                    {gamesByTag[tag].length > 0 && <MobileSlider games={gamesByTag[tag]} />}
                </div>
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-4 lg:mx-[15%]">
                    {gamesByTag[tag].map((game, index) => (
                        <GameCard key={index} game={game} />
                    ))}
                </div>
            </section>
        ))}
    </div>
    );
}
export default GameLister;