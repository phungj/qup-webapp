import {useEffect, useState} from "react";
import {MatchPlayback} from "@/src/game";
import TitleItalics from "@/components/TitleItalics";
import FlipEventRow from "@/components/FlipEventRow";

type MatchProps = {
    playback: MatchPlayback
}

// TODO: Add playerside here
// TODO: Style flipeventrow accordingly
// TODO: When there are no more flips, make the button say play again and add another one for go to skills
// TODO: Also track Q sides and upsides here
// TODO: Also track qDelta here
// TODO: Replace all Q's and UP's with golden variants

export default function Match({playback}: MatchProps) {
    const [flipIndex, setFlipIndex] = useState(0);

    const currentFlip = playback.flips[flipIndex];

    useEffect(() => {
        setFlipIndex(0);
    }, [playback]);

    function nextFlip() {
        setFlipIndex(i => i + 1);
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <TitleItalics/>
            <h1 className="font-title text-heading text-4xl font-bold mt-4 mb-4">Flip {flipIndex + 1}</h1>
            <h2 className="text-3xl mb-2 font-bold">Side: <span className="text-yellow-300">{currentFlip.result}</span></h2>
            <h2 className="text-3xl font-bold">Events</h2>
            {currentFlip.events.map((event, i) => <FlipEventRow key={i} event={event}/>)}
            <h2 className="text-3xl font-bold"><span className="text-yellow-300">Q</span> Earned: {currentFlip.qDelta}</h2>
            <button
                className="btn btn-primary"
                onClick={nextFlip}
            >
                Next Flip
            </button>
        </div>
    );
}