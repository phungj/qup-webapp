import {Player} from "@/src/player";

type StatsProps = {
    player: Player
}

export default function Stats({player}: StatsProps) {
    return (
        <div className="flex flex-col items-center">
            <h1 className="font-title text-heading text-3xl font-bold mb-2">Stats</h1>
            <h2><span className="font-bold">Q: </span>{player.q}</h2>
        </div>
    );
}