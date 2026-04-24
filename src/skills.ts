import {FlipContext} from "@/src/game";

// TODO: Standardize these types vs enums in coin
export type HexDirection = "SE" | "NE" | "N" | "NW" | "SW" | "S";

export type Trigger = "ON FLIP" | "ON WIN" | "ON LOSS" | "ON TRIGGER";

const HEX_DIR: Record<HexDirection, { dq: number; dr: number }> = {
    SE: { dq: 1, dr: 0 },
    NE: { dq: 1, dr: -1 },
    N:  { dq: 0, dr: -1 },
    NW: { dq: -1, dr: 0 },
    SW: { dq: -1, dr: 1 },
    S:  { dq: 0, dr: 1 },
} as const;

export type Skill = {
    name: string,
    description: string,
    trigger: Trigger,
    position: {
        q: number,
        r: number,
    }
    onFlip: (ctx: FlipContext, self: Skill, grid: Map<string, Skill>) => void,
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

    for (const dir of HEX_DIR) {
        const neighbor = grid.get(`${q + dir.dq},${r + dir.dr}`);
        if (neighbor) result.push(neighbor);
    }

    return result;
}

function getNeighbor(skill: Skill, grid: Map<string, Skill>, dirName: keyof typeof HEX_DIR) {
    const dir = HEX_DIR[dirName];
    return grid.get(`${skill.position.q + dir.dq},${skill.position.r + dir.dr}`);
}

export const amplifier: Skill = {
    name: "Amplifier",
    description: "+1Q per adjacent node.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    onFlip: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);
        ctx.qDelta += neighbors.length;
    }
};

export const isolation: Skill = {
    name: "Isolation",
    description: "+5Q if node has no adjacent nodes.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    onFlip: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);

        if (neighbors.length === 0) {
            ctx.qDelta += 5;
        }
    }
};

export const pawn: Skill = {
    name: "Pawn",
    description: "Trigger the node 1 space North of this.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    onFlip: (ctx, self, grid) => {
        const northNeighbor = getNeighbor(self, grid, "N");

        if (northNeighbor) {
            northNeighbor.onFlip(ctx, northNeighbor, grid);
        }
    }
}

// TODO: Possibly decorate certain triggers?
export const ezWin: Skill = {
    name: "EZ Win",
    description: "+5Q",
    trigger: "ON WIN",
    position: { q: 0, r: 0 },

    onFlip: (ctx, self, grid) => {
        if (ctx.result === ctx.playerSide) {
            ctx.qDelta += 5;
        }
    }
}
