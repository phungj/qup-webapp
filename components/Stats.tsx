import {Player} from "@/src/player";
import QUPYellow from "@/components/QUPYellow";

type StatsProps = {
    player: Player
}

export default function Stats({player}: StatsProps) {
    return (
        <div className="flex flex-col items-center">
            <h1 className="font-title text-heading text-3xl font-bold mb-2">Stats</h1>
            <h2><QUPYellow>Q: </QUPYellow>{player.q}</h2>
        </div>
    );
}