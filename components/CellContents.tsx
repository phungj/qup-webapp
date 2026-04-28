import {SkillDef} from "@/src/skills";

type CellContentsProps = {
    skill: SkillDef;
};

export default function({skill}: CellContentsProps) {
    return (
        <div>
            <h1 className="font-title text-xl font-bold mb-2">{skill.name}</h1>
            <h2>{skill.trigger}</h2>
        </div>
    )
}