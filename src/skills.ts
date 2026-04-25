import {checkWin, FlipContext} from "@/src/game";


// TODO: Standardize these types vs enums in coin
export type HexDirection = "SE" | "NE" | "N" | "NW" | "SW" | "S";

export type Trigger = "ON FLIP" | "ON WIN" | "ON LOSS" | "ON TRIGGER";

export type TriggerEvent = {
    source: SkillInstance;
    target: SkillInstance;
};

export const HEX_DIR: Record<HexDirection, { dq: number; dr: number }> = {
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

export type SkillDef = {
    id: string;
    name: string;
    description: string;
    trigger: Trigger;
    effect: (ctx: FlipContext, self: SkillInstance, grid: SkillGrid) => void;
};

export type SkillInstance = {
    def: SkillDef;
    position: {
        q: number,
        r: number
    };
};

export type SkillGrid = Map<string, SkillInstance>;

export function buildSkillMap(skills: SkillInstance[]): SkillGrid {
    const map = new Map<string, SkillInstance>();

    for (const skill of skills) {
        const key = `${skill.position.q},${skill.position.r}`;
        map.set(key, skill);
    }

    return map;
}

function getNeighbors(skill: SkillInstance, grid: SkillGrid): SkillInstance[] {
    const { q, r } = skill.position;

    const result: SkillInstance[] = [];

    for (const { dq, dr } of HEX_DIRECTIONS) {
        const neighbor = grid.get(`${q + dq},${r + dr}`);
        if (neighbor) result.push(neighbor);
    }

    return result;
}

function countNeighbors(skill: SkillInstance, grid: SkillGrid) {
    return getNeighbors(skill, grid).length;
}

function getNeighbor(
    skill: SkillInstance,
    grid: SkillGrid,
    dirName: HexDirection
) {
    const dir = HEX_DIR[dirName];
    return grid.get(`${skill.position.q + dir.dq},${skill.position.r + dir.dr}`);
}

function enqueueIfExists(
    ctx: FlipContext,
    source: SkillInstance,
    target: SkillInstance
) {
    if (!target) return;
    ctx.queue.push({ source, target });
}

export const amplifier: SkillDef = {
    id: "amplifier",
    name: "Amplifier",
    description: "+1Q per adjacent node.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        ctx.qDelta += countNeighbors(self, grid);
    }
};

export const isolation: SkillDef = {
    id: "isolation",
    name: "Isolation",
    description: "+5Q if no adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        if (countNeighbors(self, grid) === 0) {
            ctx.qDelta += 5;
        }
    }
};

export const pawn: SkillDef = {
    id: "pawn",
    name: "Pawn",
    description: "Trigger the node North.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        enqueueIfExists(ctx, self, getNeighbor(self, grid, "N"));
    }
};

export const ezWin: SkillDef = {
    id: "ez-win",
    name: "EZ Win",
    description: "+5Q",
    trigger: "ON WIN",

    effect: (ctx) => {
        ctx.qDelta += 5;
    }
};

export const focus: SkillDef = {
    id: "focus",
    name: "Focus",
    description: "Trigger a random adjacent node.",
    trigger: "ON LOSS",

    effect: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);
        if (neighbors.length > 0) {
            enqueueIfExists(ctx, self, getRandomElement(neighbors));
        }
    }
};

export const doubleDown: SkillDef = {
    id: "double-down",
    name: "Double Down",
    description: "Trigger random adjacent node.",
    trigger: "ON WIN",

    effect: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);
        if (neighbors.length > 0) {
            enqueueIfExists(ctx, self, getRandomElement(neighbors));
        }
    }
};

export const raiseTheStakes: SkillDef = {
    id: "raise-the-stakes",
    name: "Raise the Stakes",
    description: "If win: +2Q for each skill included.  If loss: -1Q for each skill included.",
    trigger: "ON FLIP",

    effect: (ctx, _, grid) => {
        const qDelta = checkWin(ctx) ? 2 : -1;
        ctx.qDelta += qDelta * grid.size;
    }
};

export const react: SkillDef = {
    id: "react",
    name: "React",
    description: "If win: trigger node N of this.  If loss: trigger node S of this.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        const dir = checkWin(ctx) ? "N" : "S";
        enqueueIfExists(ctx, self, getNeighbor(self, grid, dir));
    }
};

export const qBit: SkillDef = {
    id: "q-bit",
    name: "Qbit",
    description: "+5Q",
    trigger: "ON TRIGGER",

    effect: (ctx) => {
        ctx.qDelta += 5;
    }
};

export const relay: SkillDef = {
    id: "relay",
    name: "Relay",
    description: "+2Q per adjacent node that has another adjacent node besides the first.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        const neighbors = getNeighbors(self, grid);

        let count = 0;
        for (const n of neighbors) {
            if (countNeighbors(n, grid) > 1) count++;
        }

        ctx.qDelta += count * 2;
    }
};


export const coreStabilizer: SkillDef = {
    id: "core-stabilizer",
    name: "Core Stabilizer",
    description: "+3Q if node has 3 or more adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        if (countNeighbors(self, grid) > 2) {
            ctx.qDelta += 3;
        }
    }
};

export const balancer: SkillDef = {
    id: "balancer",
    name: "Balancer",
    description: "+6Q if node has a pair of adjacent nodes in opposite directions.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        for (const [a, b] of OPPOSITES) {
            if (
                getNeighbor(self, grid, a) &&
                getNeighbor(self, grid, b)
            ) {
                ctx.qDelta += 6;
                return;
            }
        }
    }
};

export const burst: SkillDef = {
    id: "burst",
    name: "Burst",
    description: "+1Q per adjacent node. +3Q if node has 3 or more adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        const n = countNeighbors(self, grid);

        ctx.qDelta += n;

        if (n >= 3) {
            ctx.qDelta += 3;
        }
    }
};

export const pairLink: SkillDef = {
    id: "pair-link",
    name: "Pair Link",
    description: "+4Q if node has exactly 2 adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, self, grid) => {
        if (countNeighbors(self, grid) === 2) {
            ctx.qDelta += 4;
        }
    }
};

function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}