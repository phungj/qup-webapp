import {GridCell} from "@/src/skills";
import CellContents from "@/components/CellContents";

type HexCellProps = {
    q: number,
    r: number,
    cell?: GridCell,
    onDropSkill: (skillId: string, q: number, r: number) => void,
    onRemoveSkill: (q: number, r: number) => void
};

// TODO: Refactor with hex size const
export default function HexCell({
                                    q,
                                    r,
                                    cell,
                                    onDropSkill,
                                    onRemoveSkill
                                }: HexCellProps) {
    return (
        <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                const skillId = e.dataTransfer.getData("skillId");
                onDropSkill(skillId, q, r);
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                onRemoveSkill(q, r);
            }}
            className={`
                w-32 h-32
                flex items-center justify-center
                text-xs
                bg-gray-500 border border-gray-500
                select-none
                text-center
            `}
            style={{
                clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)"
            }}
        >
            <div className="rotate-330">
                {cell ? <CellContents skill={cell.skill.def}/> : null}
            </div>
        </div>
    );
}