import SkillList from "@/components/SkillList";
import {SKILL_REGISTRY} from "@/src/parser";
import HexGrid from "@/components/HexGrid";
import {SkillGrid} from "@/src/skills";


type SkillsProps = {
    grid: SkillGrid,
    onDropSkill: (skillId: string, q: number, r: number) => void,
    onRemoveSkill: (q: number, r: number) => void
};

export default function Skills({grid, onDropSkill, onRemoveSkill}: SkillsProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            <aside className="border-r border-base-300 p-4">
                <SkillList skills={Array.from(SKILL_REGISTRY.values())} />
            </aside>

            <main className="flex-1 flex items-center justify-center">
                <HexGrid
                    grid={grid}
                    onDropSkill={onDropSkill}
                    onRemoveSkill={onRemoveSkill}
                />
            </main>
        </div>
    );
}