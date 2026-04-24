import {FlipContext} from "@/src/game";

const DIRECTIONS = [
    [1, 0], [1, -1], [0, -1],
    [-1, 0], [-1, 1], [0, 1]
];

export type Skill = {
    name: string,
    position: {
        q: number,
        r: number,
    }
    onFlip?: (ctx: FlipContext, self: Skill, grid: Map<string, Skill>) => void,
};

export function buildSkillMap(skills: Skill[]): Map<string, Skill> {
    const map = new Map<string, Skill>();

    for (const skill of skills) {
        const key = `${skill.position.q},${skill.position.r}`;
        map.set(key, skill);
    }

    return map;
}

function getNeighbors(skill: Skill, grid: Map<string, Skill>) {
    const { q, r } = skill.position;

    const result: Skill[] = [];

    for (const [dq, dr] of DIRECTIONS) {
        const neighbor = grid.get(`${q + dq},${r + dr}`);
        if (neighbor) result.push(neighbor);
    }

    return result;
}

export const amplifier: Skill = {
    name: "Amplifier",
    position: { q: 0, r: 0 },

    onFlip: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);
        ctx.ratingDelta += neighbors.length;
    }
};

export const isolation: Skill = {
    name: "Isolation",

    position: { q: 0, r: 0 },

    onFlip: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);

        if (neighbors.length === 0) {
            ctx.ratingDelta += 5;
        }
    }
};
