import {MatchState} from "@/src/game";
import TitleItalics from "@/components/TitleItalics";
import {Player} from "@/src/player";

type ResultsProps = {
    matchState: MatchState,
    playMatch: () => void,
    resetMenu: () => void,
    player: Player
}

export default function Results({matchState, playMatch, resetMenu, player}: ResultsProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center h-full gap-4">
            <TitleItalics/>
            <h1 className="font-title text-heading text-3xl font-bold mb-2">Match Results</h1>
            <h2><span className="font-bold">Player Side: </span>{matchState.playerSide}</h2>
            <h2><span className="font-bold">Q Sides: </span>{matchState.qCount}</h2>
            <h2><span className="font-bold">Up Sides: </span>{matchState.upCount}</h2>
            <h2><span className="font-bold">Q Earned: </span>{matchState.qDelta}</h2>
            <h2><span className="font-bold">Current Q: </span>{player.q}</h2>
            <div className="flex gap-5 max-w-screen">
                <button onClick={playMatch} className="btn btn-primary flex-1">Play</button>
                <button onClick={resetMenu} className="btn btn-secondary flex-1 leading-tight">Main Menu</button>
            </div>
        </div>
    );
}