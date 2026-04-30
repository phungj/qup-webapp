import {FlipEvent} from "@/src/game";
import QUPYellow from "@/components/QUPYellow";

type EventProps = {
    event: FlipEvent
}

export default function FlipEventRow({event}: EventProps) {
    switch (event.type) {
        case "base":
            return <p>Base <QUPYellow>Q</QUPYellow>: {event.delta}</p>;

        case "skill":
            return <p>{event.cell.skill.def.name} triggered</p>;

        case "trigger":
            return <p>{event.source.skill.def.name} triggers {event.target.skill.def.name}</p>;

        case "effect":
            return <p><QUPYellow>Q</QUPYellow> Earned: {event.delta}</p>;

        default:
            return null;
    }
}