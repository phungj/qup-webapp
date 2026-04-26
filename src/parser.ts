import {
    SkillDef,
    SkillGrid, SKILLS
} from "@/src/skills";
import {Player} from "@/src/player";

export type ParsedSkillInstance = {
    id: string,
    q: number;
    r: number;
};

export type PersistedPlayer = {
    hero: string,
    level: number,
    xp: number,
    money: number,
    rank: number,
    q: number,
    grid: ParsedSkillInstance[]
}

// TODO: Replace with array of inner type
export type SkillJSON = {
    skills: ParsedSkillInstance[];
};

export const SKILL_REGISTRY: Map<string, SkillDef> =
    new Map(SKILLS.map(skill => [skill.id, skill]));

export class SkillParseError extends Error {
    constructor(message: string) {
        super(message);
    }
}

// TODO: Refactor with a fixed int type
function isSkillJSON(obj: any): obj is SkillJSON {
    if (typeof obj !== "object" || obj === null) return false;

    if (!Array.isArray(obj.skills)) return false;

    for (const entry of obj.skills) {
        if (typeof entry !== "object" || entry === null) return false;

        if (typeof entry.id !== "string") return false;

        if (typeof entry.q !== "number" || !Number.isInteger(entry.q)) return false;
        if (typeof entry.r !== "number" || !Number.isInteger(entry.r)) return false;
    }

    return true;
}

export function buildSkillGrid(skills: ParsedSkillInstance[]): SkillGrid {
    const grid: SkillGrid = new Map();

    const usedIds = new Set<string>();

    for (const skill of skills) {
        const def = SKILL_REGISTRY.get(skill.id);

        if (!def) {
            throw new SkillParseError(`Unknown skill id: ${skill.id}`);
        }

        if (usedIds.has(skill.id)) {
            throw new SkillParseError(`Duplicate skill id in grid: ${skill.id}`);
        }

        usedIds.add(skill.id);

        const q = skill.q;
        const r = skill.r;
        const key = `${q},${r}`;

        if (grid.has(key)) {
            throw new SkillParseError(`Duplicate skill position at (${q}, ${r})`);
        }

        grid.set(key, {
            skill: {def},
            q,
            r
        });
    }

    return grid;
}

export function parseSkillGrid(
    json: string,
): SkillGrid {
    const data: SkillJSON = JSON.parse(json);

    if (!isSkillJSON(data)) {
        throw new SkillParseError("Invalid JSON provided");
    }

    return buildSkillGrid(data.skills);
}

function serializeSkillGrid(grid: SkillGrid) {
    const result: ParsedSkillInstance[] = [];

    for (const cell of grid.values()) {
        result.push({
            id: cell.skill.def.id,
            q: cell.q,
            r: cell.r
        });
    }

    return result;
}

export function serializePlayer(player: Player): PersistedPlayer {
    return {
        hero: player.hero,
        level: player.level,
        money: player.money,
        q: player.q,
        rank: player.rank,
        xp: player.xp,
        grid: serializeSkillGrid(player.grid)
    };
}

