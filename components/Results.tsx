import {MatchState} from "@/src/game";
import TitleItalics from "@/components/TitleItalics";
import {Player} from "@/src/player";
import {SkillsButton} from "@/components/SkillsButton";
import QUPYellow from "@/components/QUPYellow";

type ResultsProps = {
    matchState: MatchState,
    playMatch: () => void,
    skillsMenu: () => void,
    player: Player
}

export default function Results({matchState, playMatch, skillsMenu, player}: ResultsProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center h-full gap-4">
            <TitleItalics/>
            <h1 className="font-title text-heading text-3xl font-bold">Match Results</h1>
            <h2><span className="font-bold">Player Side: </span><QUPYellow>{matchState.playerSide}</QUPYellow></h2>
            <h2><span className="font-bold"><QUPYellow>Q</QUPYellow> Sides: </span>{matchState.qCount}</h2>
            <h2><span className="font-bold"><QUPYellow>UP</QUPYellow> Sides: </span>{matchState.upCount}</h2>
            <h2><span className="font-bold"><QUPYellow>Q</QUPYellow> Earned: </span>{matchState.qDelta}</h2>
            <h2><span className="font-bold">Current <QUPYellow>Q</QUPYellow>: </span>{player.q}</h2>
            <div className="grid grid-cols-2 gap-5">
                <button onClick={playMatch} className="btn btn-primary">Play</button>
                <SkillsButton showSkills={skillsMenu}/>
            </div>
        </div>
    );
}