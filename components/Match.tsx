import {useEffect, useState} from "react";
import Image from 'next/image'
import {MatchPlayback} from "@/src/game";
import TitleItalics from "@/components/TitleItalics";
import FlipEventRow from "@/components/FlipEventRow";
import Q from "@/public/Q.png";
import UP from "@/public/UP.png"

type MatchProps = {
    playback: MatchPlayback,
    showResults: () => void
}

// TODO: Add playerside here
// TODO: Style flipeventrow accordingly
// TODO: add another button on the results page to go to skills
// TODO: Also track Q sides and upsides here
// TODO: Also track current Q, possible refactor required
// TODO: Replace all Q's and UP's with golden variants (make a component)
// TODO: Add scrolling to events

export default function Match({playback, showResults}: MatchProps) {
    const [flipIndex, setFlipIndex] = useState(0);

    const currentFlip = playback.flips[flipIndex];

    const flippedQ = currentFlip.result === "Q";

    useEffect(() => {
        setFlipIndex(0);
    }, [playback]);

    function nextFlip() {
        if (flipIndex < playback.flips.length - 1) {
            setFlipIndex(i => i + 1);
        } else {
            showResults();
        }
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <TitleItalics/>
            <div className="flex gap-16 items-center justify-center">
                <div className="flex flex-col gap-1 items-center">
                    <h1 className="font-title text-heading text-4xl font-bold mt-3 mb-1">Flip {flipIndex + 1}</h1>
                    <Image src={flippedQ ? Q : UP} alt={`An image of a coin ${flippedQ ? "Q" : "UP"} side up.`} width={300} height={300} className="mb-1"/>
                </div>

                <div className="flex flex-col gap-3 max-w-md items-stretch">
                    <h1 className="text-3xl font-bold text-center">Events</h1>
                    {currentFlip.events.map((event, i) => <FlipEventRow key={i} event={event}/>)}
                    <h2 className="text-3xl font-bold text-center"><span className="text-yellow-300 font-bold">Q</span> Earned: {currentFlip.qDelta}</h2>
                    <button
                        className="btn btn-primary mx-auto"
                        onClick={nextFlip}
                    >
                        Next Flip
                    </button>
                </div>
            </div>
        </div>
    );
}

