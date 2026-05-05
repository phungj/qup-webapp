import {generateHexCoords, SkillGrid} from "@/src/skills";
import HexCell from "@/components/HexCell";

type HexGridProps = {
    grid: SkillGrid,
    onDropSkill: (skillId: string, q: number, r: number) => void,
    onRemoveSkill: (q: number, r: number) => void
};

const GRID_RADIUS = 3;
const HEX_DISTANCE = 70;

const GRID_WIDTH = 600;
const GRID_HEIGHT = 600;

const CENTER_X = GRID_WIDTH / 2;
const CENTER_Y = GRID_HEIGHT / 2;

function hexToPixel(q: number, r: number) {
    return {
        x: CENTER_X + HEX_DISTANCE * Math.sqrt(3) * (q + r / 2),
        y: CENTER_Y + HEX_DISTANCE * (3 / 2) * r
    };
}

export default function HexGrid({ grid, onDropSkill, onRemoveSkill }: HexGridProps) {
    const cells = generateHexCoords(GRID_RADIUS);
    return (
        <div className={"relative w-[600px] h-[600px] mx-auto rotate-30"}>
            {cells.map(({ q, r }) => {
                const key = `${q},${r}`;
                const cell = grid.get(key);

                const { x, y } = hexToPixel(q, r);

                return (
                    <div
                        key={key}
                        className="absolute"
                        style={{
                            left: `${x}px`,
                            top: `${y}px`,
                            transform: "translate(-50%, -50%)"
                        }}
                    >
                        <HexCell
                            q={q}
                            r={r}
                            cell={cell}
                            onDropSkill={onDropSkill}
                            onRemoveSkill={onRemoveSkill}
                        />
                    </div>
                );
            })}
        </div>
    );
}