import {SkillGrid} from "@/src/skills";

export type Player = {
    hero: string,
    level: number,
    xp: number,
    money: number,
    rank: number,
    q: number,
    grid: SkillGrid
}