import {CoinResult, flipCoin} from "@/src/coin";
import {Player} from "@/src/player";
import {
    GridCell,
    SkillGrid,
    SkillRef, Trigger,
    TriggerEvent
} from "@/src/skills";

export type FlipContext = {
    result: CoinResult;
    playerSide: CoinResult;
    qDelta: number;

    queue: TriggerEvent[],
    triggered: Set<GridCell>;
};

export type MatchState = {
    qDelta: number;
    qCount: number;
    upCount: number;
    playerSide: CoinResult;
};

type FlipResult = {
    result: CoinResult,
    qDelta: number
}

export type FlipEvent =
    | { type: "flip"; result: CoinResult }
    | { type: "base"; delta: number }
    | { type: "skill"; cell: GridCell; trigger: Trigger }
    | { type: "trigger"; source: GridCell; target: GridCell }
    | { type: "effect"; cell: GridCell; delta: number };

type FlipPlayback = {
    result: CoinResult;
    qDelta: number;
    events: FlipEvent[];
};

export type MatchPlayback = {
    flips: FlipPlayback[];
    final: MatchState;
};

export function checkWin(ctx: FlipContext) {
    return ctx.result === ctx.playerSide;
}

export function runMatch(player: Player): MatchPlayback {
    const playerSide = flipCoin();

    let qCount = 0;
    let upCount = 0;
    let totalDelta = 0;

    const flips: FlipPlayback[] = [];

    while (qCount < 3 && upCount < 3) {
        const flip = runFlip(player, playerSide, player.grid);

        flips.push(flip)
        totalDelta += flip.qDelta;

        if (flip.result === CoinResult.Q) {
            qCount += 1;
        } else {
            upCount += 1;
        }
    }

    return { flips,
        final: {qDelta: totalDelta, qCount, upCount, playerSide }};
}

function runFlip(player: Player, playerSide: CoinResult, skillGrid: SkillGrid): FlipPlayback {
    const events: FlipEvent[] = [];

    const context: FlipContext = {
        result: flipCoin(),
        playerSide: playerSide,
        qDelta: 0,
        queue: [],
        triggered: new Set()
    };

    events.push({ type: "flip", result: context.result });

    const won = checkWin(context);

    const baseDelta = won ? 1 : getLossPenalty(player);
    context.qDelta += baseDelta;

    events.push({ type: "base", delta: baseDelta });

    for (const cell of skillGrid.values()) {
        const skill = cell.skill;

        if (!shouldExecute(skill, context)) continue;

        context.triggered.clear();

        events.push({
            type: "skill",
            cell,
            trigger: skill.def.trigger
        });

        const before = context.qDelta;

        skill.def.effect(context, cell, skillGrid);

        const delta = context.qDelta - before;

        events.push({
            type: "effect",
            cell,
            delta
        });

        processTriggers(context, skillGrid, events);
    }

    return {
        result: context.result,
        qDelta: context.qDelta,
        events
    }
}

function processTriggers(ctx: FlipContext, grid: SkillGrid, events: FlipEvent[]) {
    while (ctx.queue.length > 0) {
        const { source, target } = ctx.queue.shift()!;

        events.push({
            type: "trigger",
            source,
            target
        });

        if (ctx.triggered.has(target)) continue;
        ctx.triggered.add(target);

        const before = ctx.qDelta;

        target.skill.def.effect(ctx, target, grid);

        const delta = ctx.qDelta - before;

        events.push({
            type: "effect",
            cell: target,
            delta
        });
    }
}

function shouldExecute(skill: SkillRef, ctx: FlipContext): boolean {
    switch (skill.def.trigger) {
        case "ON FLIP":
            return true;
        case "ON WIN":
            return ctx.result === ctx.playerSide;
        case "ON LOSS":
            return ctx.result !== ctx.playerSide;
        case "ON TRIGGER":
            return false;
    }
}

function getLossPenalty(player: Player): number {
    return -Math.max(1, Math.round(0.2 * player.q));
}

// TODO: Replace all Q's and UP's with golden variants

// TODO: Add a button for loading via json if desired
// TODO: Make drag image consistent with other cells
// TODO: Add functionality to export your skills
// TODO: Add additional confirmation or saving functionality when closing skill import when you have an input
// TODO: Add ability to drag hexes already on the grid
// TODO: Add angular skill
// TODO: Flesh out the help page
// TODO: Make import skill box larger

// TODO: Unify cell styling via css (rotation, color)
// TODO: Look into reducer based system
// TODO: Then possibly start thinking about qmult or real balance
// TODO: Then start thinking about hero implementations
// TODO: Then possibly start caring about iteration order
// TODO: Add helper icons that indicate what nodes a skill effects