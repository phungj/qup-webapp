import { SkillDef } from "@/src/skills";
import {useMemo, useState} from "react";
import CellContents from "@/components/CellContents";
import Tooltip from "@/components/Tooltip";

type HexTileProps = {
    skill: SkillDef;
};

function createHexDragImage(skillName: string) {
    const size = 128;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d")!;

    const hex = new Path2D();
    hex.moveTo(size * 0.25, size * 0.05);
    hex.lineTo(size * 0.75, size * 0.05);
    hex.lineTo(size, size * 0.5);
    hex.lineTo(size * 0.75, size * 0.95);
    hex.lineTo(size * 0.25, size * 0.95);
    hex.lineTo(0, size * 0.5);
    hex.closePath();

    ctx.fillStyle = "#e5e7eb";
    ctx.fill(hex);

    ctx.strokeStyle = "#d1d5db";
    ctx.stroke(hex);

    ctx.fillStyle = "#000";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(skillName, size / 2, size / 2);

    const img = new Image();
    img.src = canvas.toDataURL("image/png");

    return img;
}

export default function SkillTile({ skill }: HexTileProps) {
    const dragImageRef = useMemo(() => {
        return createHexDragImage(skill.name);
    }, [skill.name]);

    return (
        <Tooltip content={<p>{skill.description}</p>}>
            <div
                draggable="true"
                onDragStart={(e) => {
                    e.dataTransfer.setData("skillId", skill.id);
                    e.dataTransfer.setDragImage(dragImageRef, 64, 64);
                }}
                className="
            w-32 h-32
            flex flex-col items-center justify-center
            text-center text-xs
            bg-gray-500 border border-gray-500
            select-none cursor-grab hover:bg-base-300
        "
                style={{
                    clipPath:
                        "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)"
                }}
            >
                <CellContents skill={skill} />
            </div>
        </Tooltip>
    );
}