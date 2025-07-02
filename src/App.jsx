import React from "react";
import GameListBlocks from "./Components/GenreButtons/GameListBlocks";
import GameLibInfo from "./Components/InfoSection/GameLibInfo";
import GameLister from "./Components/GameLister/GameLister";
import FeaturedSlider from "./Components/FeaturedSlider/FeaturedSlider";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import ParticleBackground from "./Components/Background/ParticleBackground";



export default function App() {
    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <ParticleBackground />
            <div className="relative z-10 w-full">
                <GameLibInfo/>
                <GameListBlocks/>
                <div className="hidden sm:block">
                    <FeaturedSlider />
                </div>
                <GameLister />
            </div>
            <ScrollToTop />
        </div>
    );
}

