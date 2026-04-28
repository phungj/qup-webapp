import {CoinResult, flipCoin} from "@/src/coin";
import {Player} from "@/src/player";
import {
    GridCell,
    SkillGrid,
    SkillRef,
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

export function checkWin(ctx: FlipContext) {
    return ctx.result === ctx.playerSide;
}

export function runMatch(player: Player): MatchState {
    const playerSide = flipCoin();

    let qCount = 0;
    let upCount = 0;
    let totalDelta = 0;

    while (qCount < 3 && upCount < 3) {
        const { result, qDelta } = runFlip(player, playerSide, player.grid);

        totalDelta += qDelta;

        if (result === CoinResult.Q) {
            qCount += 1;
        } else {
            upCount += 1;
        }
    }

    return { qDelta: totalDelta, qCount, upCount, playerSide };
}

function runFlip(player: Player, playerSide: CoinResult, skillGrid: SkillGrid): FlipResult {
    const context: FlipContext = {
        result: flipCoin(),
        playerSide: playerSide,
        qDelta: 0,
        queue: [],
        triggered: new Set()
    };

    const won = checkWin(context);

    context.qDelta += won ? 1 : getLossPenalty(player);

    for (const cell of skillGrid.values()) {
        const skill = cell.skill;

        if (!shouldExecute(skill, context)) continue;

        context.triggered.clear();

        skill.def.effect(context, cell, skillGrid);

        processTriggers(context, skillGrid);
    }

    return {
        result: context.result,
        qDelta: context.qDelta
    }
}

function processTriggers(ctx: FlipContext, grid: SkillGrid) {
    while (ctx.queue.length > 0) {
        const { source, target } = ctx.queue.shift()!;

        if (ctx.triggered.has(target)) continue;
        ctx.triggered.add(target);

        target.skill.def.effect(ctx, target, grid);
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

// TODO: Create a reusable tooltip component
// TODO: add tooltips to hex grid (create component for this?)
// TODO: Integrate into a component
// TODO: Integrate into main menu
// TODO: Test skills and saving and loading
// TODO: Add a button for loading via json if desired
// TODO: Compile


// TODO: Make drag image consistent with other cells
// TODO: Add functionality to export your skills
// TODO: Add additional confirmation or saving functionality when closing skill import when you have an input
// TODO: Add ability to drag hexes already on the grid
// TODO: Add angular skill
// TODO: Flesh out the help page
// TODO: Make import skill box larger
// TODO: Keep track of skills that have been placed and remove them from the sidebar accordingly
// TODO: Then possibly refactor runmatch to return a list of events to be rendered that describe how Q was computed
// TODO: Then possibly refactor matchresult to be an array of flip results

// TODO: Unify cell styling via css (rotation, color)
// TODO: Look into reducer based system
// TODO: Then possibly start thinking about qmult or real balance
// TODO: Then possibly start caring about iteration order
