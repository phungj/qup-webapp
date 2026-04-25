import {
    amplifier,
    isolation,
    pawn,
    ezWin,
    focus,
    doubleDown,
    raiseTheStakes,
    react,
    qBit,
    relay,
    coreStabilizer,
    balancer,
    burst,
    pairLink,
    SkillDef,
    SkillGrid
} from "@/src/skills";

export type ParsedSkillInstance = {
    def: SkillDef;
    q: number;
    r: number;
};

type SkillJSON = {
    skills: {
        id: string;
        q: number;
        r: number;
    }[];
};

const SKILL_REGISTRY: Map<string, SkillDef> = new Map([
    ["amplifier", amplifier],
    ["isolation", isolation],
    ["pawn", pawn],
    ["ez-win", ezWin],
    ["focus", focus],
    ["double-down", doubleDown],
    ["raise-the-stakes", raiseTheStakes],
    ["react", react],
    ["q-bit", qBit],
    ["relay", relay],
    ["core-stabilizer", coreStabilizer],
    ["balancer", balancer],
    ["burst", burst],
    ["pair-link", pairLink],
]);

export function parseSkillGrid(
    json: string,
): SkillGrid {
    const data: SkillJSON = JSON.parse(json);
    const grid: SkillGrid = new Map();

    for (const entry of data.skills) {
        const def = SKILL_REGISTRY.get(entry.id);

        if (!def) {
            throw new Error(`Unknown skill id: ${entry.id}`);
        }

        const q = entry.q;
        const r = entry.r;

        grid.set(`${q},${r}`, {
            skill: { def },
            q,
            r
        });
    }

    return grid;
}