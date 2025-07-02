import React, { useEffect, useState } from "react";
import gamesData from "../games.json";

// Create genre-to-images mapping
const genreImages = gamesData.games.reduce((acc, game) => {
  game.tag.forEach(tag => {
    const genre = tag.toUpperCase();
    if (!acc[genre]) acc[genre] = [];
    acc[genre].push(game.src);
  });
  return acc;
}, {});

const genres = Object.keys(genreImages);
const specialTags = ['SINGLEPLAYER', 'CASUAL', 'MULTIPLAYER', 'COOPERATIVE'];
const specialGenres = genres.filter(genre => specialTags.includes(genre));
const regularGenres = genres.filter(genre => !specialTags.includes(genre));

export default function GameListBlocks() {
  const [currentIndexes, setCurrentIndexes] = useState(() => {
    const initial = {};
    genres.forEach((g) => {
      initial[g] = 0;
    });
    return initial;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndexes((prev) => {
        const updated = {};
        for (const genre of genres) {
          const imgs = genreImages[genre] || [];
          updated[genre] = (prev[genre] + 1) % imgs.length;
        }
        return updated;
      });
    }, 15000); // 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-transparent flex flex-col items-center justify-center px-4 py-6">
      {/* Special Tags Section */}
      <div className="w-full max-w-7xl mb-6">
        <div className="grid grid-cols-4 gap-3 sm:gap-6">
          {specialGenres.map((genre) => {
            const handleGenreClick = () => {
              const element = document.getElementById(`genre-${genre.toLowerCase()}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              if (window.triggerParticleRotationAnimation) {
                window.triggerParticleRotationAnimation();
              }
            };

            return (
              <div 
                key={genre}
                onClick={handleGenreClick}
                className="relative w-full h-16 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 text-white font-bold rounded-lg overflow-hidden group cursor-pointer transform hover:scale-105 transition-all duration-500 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>
                <div className="absolute inset-[2px] bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 rounded-lg"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center delay-100"></div>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-purple-500 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-center delay-200"></div>
                <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-center delay-300"></div>
                <span className="relative z-20 drop-shadow-lg text-sm font-black tracking-widest uppercase group-hover:animate-pulse" style={{fontFamily: 'Orbitron, "Bebas Neue", "Arial Black", sans-serif'}}>
                  {genre.split('').map((letter, i) => (
                    <span key={i} className="inline-block group-hover:animate-bounce" style={{animationDelay: `${i * 100}ms`}}>{letter}</span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regular Tags Section - 1x8 Grid */}
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-8 grid-rows-1 gap-3 sm:gap-6">
          {regularGenres.map((genre, index) => {
            const handleGenreClick = () => {
              const element = document.getElementById(`genre-${genre.toLowerCase()}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              if (window.triggerParticleRotationAnimation) {
                window.triggerParticleRotationAnimation();
              }
            };

            return (
              <div 
                key={genre}
                onClick={handleGenreClick}
                className="relative w-full h-12 bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 text-green-400 font-semibold rounded-md overflow-hidden group cursor-pointer hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                <div className="absolute inset-[1px] bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 rounded-md"></div>
                <div className="absolute top-0 left-0 w-full h-[1px] bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-green-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right delay-150"></div>
                <div className="absolute top-0 left-0 w-[1px] h-full bg-green-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top delay-75"></div>
                <div className="absolute top-0 right-0 w-[1px] h-full bg-green-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom delay-225"></div>
                <span className="relative z-10 text-xs font-bold tracking-wider uppercase" style={{fontFamily: 'Orbitron, "Courier New", monospace'}}>
                  {genre.split('').map((letter, i) => (
                    <span key={i} className="inline-block group-hover:animate-pulse" style={{animationDelay: `${i * 50}ms`}}>{letter}</span>
                  ))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

