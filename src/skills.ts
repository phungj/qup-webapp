import {FlipContext} from "@/src/game";


// TODO: Standardize these types vs enums in coin
export type HexDirection = "SE" | "NE" | "N" | "NW" | "SW" | "S";

export type Trigger = "ON FLIP" | "ON WIN" | "ON LOSS" | "ON TRIGGER";

export type TriggerEvent = {
    skill: Skill;
    source?: Skill;
};

const HEX_DIR: Record<HexDirection, { dq: number; dr: number }> = {
    SE: { dq: 1, dr: 0 },
    NE: { dq: 1, dr: -1 },
    N:  { dq: 0, dr: -1 },
    NW: { dq: -1, dr: 0 },
    SW: { dq: -1, dr: 1 },
    S:  { dq: 0, dr: 1 },
} as const;

const HEX_DIRECTIONS = Object.values(HEX_DIR);

const OPPOSITES: [HexDirection, HexDirection][] = [
    ["N", "S"],
    ["NE", "SW"],
    ["NW", "SE"]
] as const;

export type Skill = {
    id: number,
    name: string,
    description: string,
    trigger: Trigger,
    position: {
        q: number,
        r: number,
    }
    effect: (ctx: FlipContext, self: Skill, grid: Map<string, Skill>) => void,
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

    for (const { dq, dr } of HEX_DIRECTIONS) {
        const neighbor = grid.get(`${q + dq},${r + dr}`);
        if (neighbor) result.push(neighbor);
    }

    return result;
}

function countNeighbors(skill: Skill, grid: Map<string, Skill>) {
    return getNeighbors(skill, grid).length;
}

function getNeighbor(
    skill: Skill,
    grid: Map<string, Skill>,
    dirName: HexDirection
) {
    const dir = HEX_DIR[dirName];
    return grid.get(`${skill.position.q + dir.dq},${skill.position.r + dir.dr}`);
}

function enqueueIfExists(
    ctx: FlipContext,
    target: Skill | undefined,
    source: Skill
) {
    if (!target) return;
    ctx.queue.push({ skill: target, source });
}

export const amplifier: Skill = {
    id: 0,
    name: "Amplifier",
    description: "+1Q per adjacent node.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        ctx.qDelta += countNeighbors(self, grid);
    }
};

export const isolation: Skill = {
    id: 1,
    name: "Isolation",
    description: "+5Q if node has no adjacent nodes.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        if (countNeighbors(self, grid) === 0) {
            ctx.qDelta += 5;
        }
    }
};

export const pawn: Skill = {
    id: 2,
    name: "Pawn",
    description: "Trigger the node 1 space North of this.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        enqueueIfExists(ctx, getNeighbor(self, grid, "N"), self);
    }
}

// TODO: Possibly decorate certain triggers?
export const ezWin: Skill = {
    id: 3,
    name: "EZ Win",
    description: "+5Q",
    trigger: "ON WIN",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        ctx.qDelta += 5;
    }
}

export const focus: Skill = {
    id: 4,
    name: "Focus",
    description: "Trigger a random adjacent node.",
    trigger: "ON LOSS",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);

        if (neighbors.length > 0) {
            enqueueIfExists(ctx, getRandomElement(neighbors), self);
        }
    }
}

export const doubleDown: Skill = {
    id: 5,
    name: "Double Down",
    description: "Trigger a random adjacent node.",
    trigger: "ON WIN",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);

        if (neighbors.length > 0) {
            enqueueIfExists(ctx, getRandomElement(neighbors), self);
        }
    }
}

export const raiseTheStakes: Skill = {
    id: 6,
    name: "Raise the Stakes",
    description: "If win: +2Q for each skill included.  If loss: -1Q for each skill included.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        const qDelta = checkWin(ctx) ? 2 : -1;

        ctx.qDelta += qDelta * grid.size;
    }
}

export const react: Skill = {
    id: 7,
    name: "React",
    description: "If win: trigger node N of this.  If loss: trigger node S of this.",
    trigger: "ON FLIP",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        const dir = checkWin(ctx) ? "N" : "S";
        enqueueIfExists(ctx, getNeighbor(self, grid, dir), self);
    }
}

export const qBit: Skill = {
    id: 8,
    name: "Qbit",
    description: "+5Q",
    trigger: "ON TRIGGER",
    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        ctx.qDelta += 5;
    }
}

export const relay: Skill = {
    id: 9,
    name: "Relay",
    description: "+2Q per adjacent node that has another adjacent node.",
    trigger: "ON FLIP",

    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);

        let count = 0;
        for (const n of neighbors) {
            if (countNeighbors(n, grid) > 1) count++;
        }

        ctx.qDelta += count * 2;
    }
};

export const coreStabilizer: Skill = {
    id: 10,
    name: "Core Stabilizer",
    description: "+3Q if node has 3 or more adjacent nodes.",
    trigger: "ON FLIP",

    position: { q: 0, r: 0 },

    effect: (ctx, self, grid) => {
        if (countNeighbors(self, grid) > 2) {
            ctx.qDelta += 3;
        }
    }
};

function checkWin(ctx: FlipContext) {
    return ctx.result === ctx.playerSide;
}

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}