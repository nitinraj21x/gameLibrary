import { useState, useEffect } from 'react';
import GameCard from "./GameCard.jsx";

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
        <div className="min-h-screen text-white font-sans p-6 sm:p-10">
        {/* Page Title */}
        <h1 className="text-5xl font-gaming font-black text-center mb-12 drop-shadow-lg game-library-text">
            Our Game Collection
        </h1>

        {/* All Games Section */}
        <section className="mb-16">
            <div className="gListerContainer">                
                <h2 className="text-4xl font-gaming font-black text-center mb-10 border-b-4 border-blue-500 pb-3 game-library-text">
                    ALL Games
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:mx-[15%]">
                    {allGames.map((game, index) => (
                        <GameCard key={index} game={game} />
                    ))}
                </div>
            </div>
        </section>

        {/* Sections by Tag */}
        {uniqueTags.map(tag => (
            <section key={tag} id={`genre-${tag.toLowerCase()}`} className="mb-16">
                <h2 className="text-4xl font-gaming font-black text-center mb-10 border-b-4 border-blue-500 pb-3 capitalize game-library-text">
                    {tag} Games
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 lg:mx-[15%]">
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