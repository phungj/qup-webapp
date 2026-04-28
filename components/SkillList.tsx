import {SkillDef} from "@/src/skills";
import SkillTile from "@/components/SkillTile";

type SkillListProps = {
    skills: SkillDef[]
}

export default function SkillList({skills}: SkillListProps) {
    return (
        <div className="grid grid-cols-3 gap-5">
            {skills.map((skill, i) => <SkillTile key={i} skill={skill}/>)}
        </div>
    );
}