// TODO: Implement user statistics tracking like w-l

import {SkillInstance} from "@/src/skills";

export type Player = {
    hero: string,
    level: number,
    xp: number,
    money: number,
    rank: number,
    q: number,
    skills: SkillInstance[]
}