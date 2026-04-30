import {useEffect, useState} from "react";
import Image from 'next/image'
import {MatchPlayback} from "@/src/game";
import TitleItalics from "@/components/TitleItalics";
import FlipEventRow from "@/components/FlipEventRow";
import qImage from "@/public/Q.png";
import upImage from "@/public/UP.png"
import QUPYellow from "@/components/QUPYellow";

type MatchProps = {
    playback: MatchPlayback,
    showResults: () => void
}

export default function Match({playback, showResults}: MatchProps) {
    const [flipIndex, setFlipIndex] = useState(0);

    const notLastFlip = flipIndex < playback.flips.length - 1;

    const currentFlip = playback.flips[flipIndex];

    const flippedQ = currentFlip.result === "Q";

    useEffect(() => {
        setFlipIndex(0);
    }, [playback]);

    function nextFlip() {
        if (notLastFlip) {
            setFlipIndex(i => i + 1);
        } else {
            showResults();
        }
    }

    const seenFlips = playback.flips.slice(0, flipIndex + 1);

    const qCount = seenFlips.filter(f => f.result === "Q").length;
    const upCount = seenFlips.length - qCount;

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <TitleItalics/>
            <div className="flex gap-24 mt-3 mb-2">
                <h1 className="font-title text-heading text-4xl font-bold">Player Side: <span className="text-yellow-300">{playback.final.playerSide}</span></h1>
                <h1 className="font-title text-heading text-4xl"><span className="font-bold">Current <QUPYellow>Q</QUPYellow>: </span>{currentFlip.qBefore}</h1>
            </div>
            <div className="flex gap-45 mt-3 mb-2">
                <h1 className="font-title text-heading text-4xl"><span className="font-bold"><QUPYellow>Q</QUPYellow> Sides: </span>{qCount}</h1>
                <h1 className="font-title text-heading text-4xl"><span className="font-bold"><QUPYellow>UP</QUPYellow> Sides: </span>{upCount}</h1>
            </div>
            <div className="flex gap-16 items-center justify-center">
                <div className="flex flex-col gap-1 items-center">
                    <h1 className="font-title text-heading text-4xl font-bold mt-3 mb-1">Flip {flipIndex + 1}</h1>
                    <Image src={flippedQ ? qImage : upImage} alt={`An image of a coin ${flippedQ ? "Q" : "UP"} side up.`} width={300} height={300} className="mb-1"/>
                </div>

                <div className="flex flex-col gap-3 w-[250px] max-w-md items-stretch">
                    <h1 className="text-3xl font-bold text-center">Events</h1>
                    <div className="max-h-45 overflow-y-auto flex flex-col gap-2 px-2">
                        {currentFlip.events.map((event, i) => <FlipEventRow key={i} event={event}/>)}
                    </div>
                    <h2 className="text-3xl font-bold text-center"><QUPYellow>Q</QUPYellow> Earned: {currentFlip.qDelta}</h2>
                    <button
                        className="btn btn-primary mx-auto"
                        onClick={nextFlip}
                    >
                        {notLastFlip ? "Next Flip" : "Results"}
                    </button>
                </div>
            </div>
        </div>
    );
}

