import {SkillDef} from "@/src/skills";

type SkillCardProps = {
    skill: SkillDef
}

export default function SkillCard({skill}: SkillCardProps) {
    return (
        <div className="card">
            <div className="card-body items-center text-center">
                <h2 className="card-title">{skill.name}</h2>
                <h3 className="text-gray-500 italic text-xs">ID: {skill.id}</h3>
                <h2>{skill.trigger}</h2>
                <h2>{skill.description}</h2>
            </div>
        </div>
    );
}