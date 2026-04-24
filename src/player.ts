// TODO: Implement user statistics tracking like w-l

import {Skill} from "@/src/skills";

export type Player = {
    hero: string,
    level: number,
    xp: number,
    money: number,
    ranking: number,
    rating: number,
    skills: Skill[]
}