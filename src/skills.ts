import {checkWin, FlipContext} from "@/src/game";
import {ParsedSkillInstance} from "@/src/parser";


// TODO: Standardize these types vs enums in coin
export type HexDirection = "SE" | "NE" | "N" | "NW" | "SW" | "S";

export type Trigger = "ON FLIP" | "ON WIN" | "ON LOSS" | "ON TRIGGER";

export type TriggerEvent = {
    source: GridCell;
    target: GridCell;
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
    effect: (ctx: FlipContext, cell: GridCell, grid: SkillGrid) => void;
};

export type SkillRef = {
    def: SkillDef;
};

export type GridCell = {
    skill: SkillRef;
    q: number;
    r: number;
};

// TODO: Refactor this to not be a string key
export type SkillGrid = Map<string, GridCell>;

function getNeighbors(
    cell: GridCell,
    grid: SkillGrid
): GridCell[] {
    const result: GridCell[] = [];

    for (const { dq, dr } of HEX_DIRECTIONS) {
        const neighbor = grid.get(`${cell.q + dq},${cell.r + dr}`);
        if (neighbor) result.push(neighbor);
    }

    return result;
}

function countNeighbors(cell: GridCell, grid: SkillGrid) {
    return getNeighbors(cell, grid).length;
}

function getNeighbor(
    cell: GridCell,
    grid: SkillGrid,
    dirName: HexDirection
): GridCell | undefined {
    const dir = HEX_DIR[dirName];
    return grid.get(`${cell.q + dir.dq},${cell.r + dir.dr}`);
}

function enqueueIfExists(
    ctx: FlipContext,
    source: GridCell,
    target: GridCell | undefined
) {
    if (!target) return;
    ctx.queue.push({source, target});
}

export const amplifier: SkillDef = {
    id: "amplifier",
    name: "Amplifier",
    description: "+1Q per adjacent node.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        ctx.qDelta += countNeighbors(cell, grid);
    }
};

export const isolation: SkillDef = {
    id: "isolation",
    name: "Isolation",
    description: "+5Q if no adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        if (countNeighbors(cell, grid) === 0) {
            ctx.qDelta += 5;
        }
    }
};

export const pawn: SkillDef = {
    id: "pawn",
    name: "Pawn",
    description: "Trigger the node 1 space North of this.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        enqueueIfExists(ctx, cell, getNeighbor(cell, grid, "N"));
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

    effect: (ctx, cell, grid) => {
        const neighbors = getNeighbors(cell, grid);

        if (neighbors.length > 0) {
            enqueueIfExists(ctx, cell, getRandomElement(neighbors));
        }
    }
};

export const doubleDown: SkillDef = {
    id: "double-down",
    name: "Double Down",
    description: "Trigger a random adjacent node.",
    trigger: "ON WIN",

    effect: (ctx, cell, grid) => {
        const neighbors = getNeighbors(cell, grid);

        if (neighbors.length > 0) {
            enqueueIfExists(ctx, cell, getRandomElement(neighbors));
        }
    }
};

export const raiseTheStakes: SkillDef = {
    id: "raise-the-stakes",
    name: "Raise the Stakes",
    description: "If win: +2Q for each skill included.  If loss: -1Q for each skill included.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        const delta = checkWin(ctx) ? 2 : -1;
        ctx.qDelta += delta * grid.size;
    }
};

export const react: SkillDef = {
    id: "react",
    name: "React",
    description: "If win: trigger node N of this.  If loss: trigger node S of this.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        const dir = checkWin(ctx) ? "N" : "S";
        enqueueIfExists(ctx, cell, getNeighbor(cell, grid, dir));
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
    description: "+2Q per adjacent node that has another adjacent node besides this.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        const neighbors = getNeighbors(cell, grid);

        let count = 0;

        for (const neighbor of neighbors) {
            if (countNeighbors(neighbor, grid) > 1) {
                count++;
            }
        }

        ctx.qDelta += count * 2;
    }
};


export const coreStabilizer: SkillDef = {
    id: "core-stabilizer",
    name: "Core Stabilizer",
    description: "+3Q if this has 3 or more adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        if (countNeighbors(cell, grid) >= 3) {
            ctx.qDelta += 3;
        }
    }
};

export const balancer: SkillDef = {
    id: "balancer",
    name: "Balancer",
    description: "+6Q if this has a pair of adjacent nodes in opposite directions.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        for (const [a, b] of OPPOSITES) {
            if (
                getNeighbor(cell, grid, a) &&
                getNeighbor(cell, grid, b)
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
    description: "+1Q per adjacent node. +3Q if this has 3 or more adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        const n = countNeighbors(cell, grid);

        ctx.qDelta += n;

        if (n >= 3) {
            ctx.qDelta += 3;
        }
    }
};

export const pairLink: SkillDef = {
    id: "pair-link",
    name: "Pair Link",
    description: "+4Q if this has exactly 2 adjacent nodes.",
    trigger: "ON FLIP",

    effect: (ctx, cell, grid) => {
        if (countNeighbors(cell, grid) === 2) {
            ctx.qDelta += 4;
        }
    }
};

function getRandomElement<T>(array: readonly T[], rng=Math.random): T | undefined {
    if (array.length === 0) return undefined;
    return array[Math.floor(rng() * array.length)];
}