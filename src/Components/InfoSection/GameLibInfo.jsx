import { useState, useEffect } from 'react';

export default function GameLibInfo() {
    const fullText = "You thought there will be valid info here? think again... You came here to play games, why the fck are you still reading this. Scroll down and play your game, you NOOB";
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            if (index < fullText.length) {
                setDisplayText(fullText.slice(0, index + 1));
                index++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
    <section className="flex flex-col md:flex-row h-auto md:h-72 items-center text-white px-4 sm:px-8 lg:px-[18%] py-8">
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl h-auto md:h-full w-full md:w-1/2 flex items-center justify-center md:justify-start font-gaming font-black mb-4 md:mb-0 game-library-text">GAME LIBRARY</div>
        <div className="gLibInfo h-auto md:h-full w-full md:w-1/2 flex items-center text-sm sm:text-base lg:text-lg text-center md:text-left font-mono">{displayText}<span className="animate-pulse">|</span></div>
    </section>
    )
}
