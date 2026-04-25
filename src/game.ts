import {CoinResult, flipCoin} from "@/src/coin";
import {Player} from "@/src/player";
import {
    buildSkillMap, HEX_DIR,
    isolation,
    pawn,
    qBit,
    SkillGrid,
    SkillInstance,
    TriggerEvent
} from "@/src/skills";

export type FlipContext = {
    result: CoinResult;
    playerSide: CoinResult;
    qDelta: number;

    queue: TriggerEvent[],
    triggered: Set<SkillInstance>;
};

export function checkWin(ctx: FlipContext) {
    return ctx.result === ctx.playerSide;
}

function runMatch(player: Player) {
    const playerSide = flipCoin();
    const skillGrid = buildSkillMap(player.skills);

    let qCount = 0;
    let upCount = 0;

    while (qCount < 3 && upCount < 3) {
        if (runFlip(player, playerSide, skillGrid) === CoinResult.Q) {
            qCount += 1;
        } else {
            upCount += 1;
        }
    }

    return { qCount, upCount, playerSide };
}

function runFlip(player: Player, playerSide: CoinResult, skillGrid: SkillGrid): CoinResult {
    const context: FlipContext = {
        result: flipCoin(),
        playerSide: playerSide,
        qDelta: 0,
        queue: [],
        triggered: new Set()
    };

    const won = checkWin(context);

    context.qDelta += won ? 1 : getLossPenalty(player);

    for (const skill of skillGrid.values()) {
        if (!shouldExecute(skill, context)) continue;

        context.triggered.clear();

        skill.def.effect(context, skill, skillGrid);

        processTriggers(context, skillGrid);
    }

    player.q = Math.max(0, player.q + context.qDelta);

    return context.result;
}

function processTriggers(ctx: FlipContext, grid: SkillGrid) {
    while (ctx.queue.length > 0) {
        const { source, target } = ctx.queue.shift();

        if (ctx.triggered.has(target)) continue;
        ctx.triggered.add(target);

        target.def.effect(ctx, target, grid);
    }
}

function shouldExecute(skill: SkillInstance, ctx: FlipContext): boolean {
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

// TODO: Refactor by eliminating the position from the skill
// TODO: Then move onto parsing skill descriptions
// TODO: Then move onto making it a basic web app with the results of runmatch
// TODO: Then add skill parsing to the GUI
// TODO: Then add saving and loading the player
// TODO: Then deploy!
// TODO: Then possibly start thinking about qmult or real balance
// TODO: Then possibly start caring about iteration order
// TODO: Then possibly refactor runmatch to return a list of events to be rendered
const player: Player = {hero: "", level: 0, money: 0, rank: 0, q: 0, xp: 0, skills: [{def: pawn, position: {q: 0, r: 0}}, {def: qBit, position: {q: HEX_DIR.N.dq, r: HEX_DIR.N.dr}}]}

console.log(runMatch(player));
console.log(player.q);