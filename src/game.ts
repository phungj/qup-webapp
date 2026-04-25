import {CoinResult, flipCoin} from "@/src/coin";
import {Player} from "@/src/player";
import {buildSkillMap, Skill, TriggerEvent} from "@/src/skills";

export type FlipContext = {
    result: CoinResult;
    playerSide: CoinResult;
    qDelta: number;

    queue: TriggerEvent[],
    triggered: Set<number>;
};

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

    return { qCount, upCount, winningSide: playerSide };
}

function runFlip(player: Player, playerSide: CoinResult, skillGrid: Map<string, Skill>): CoinResult {
    const context: FlipContext = {
        result: flipCoin(),
        playerSide: playerSide,
        qDelta: 0,
        queue: [],
        triggered: new Set()
    };

    if (context.result === context.playerSide) {
        context.qDelta += 1;
    } else {
        context.qDelta -= 1;

        // context.ratingDelta -= Math.max(1, 0.2 * player.rating);
    }

    for (const skill of skillGrid.values()) {
        if (!shouldExecute(skill, context)) continue;

        context.triggered.clear();

        skill.effect(context, skill, skillGrid);

        processTriggers(context, skillGrid);
    }

    player.q = Math.max(0, player.q + context.qDelta);

    return context.result;
}

function processTriggers(ctx: FlipContext, grid: Map<string, Skill>) {
    while (ctx.queue.length > 0) {
        const { skill, source } = ctx.queue.shift()!;

        if (ctx.triggered.has(skill.id)) continue;
        ctx.triggered.add(skill.id);

        skill.effect(ctx, skill, grid);
    }
}

function shouldExecute(skill: Skill, ctx: FlipContext): boolean {
    switch (skill.trigger) {
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

// TODO: Do the skill instance refactor
// TODO: Look at other/rest of interesting skills
// TODO: Test spatial skills
// TODO: making the rating delta decay for losing proportional to your current rating (start with 0.2)
// TODO: Then move onto parsing skill descriptions
// TODO: Then move onto making it a basic web app with the results of runmatch
// TODO: Then add skill parsing to the GUI
// TODO: Then add saving and loading the player
// TODO: Then deploy!
// TODO: Then possibly start thinking about qmult or real balance
// TODO: Then possibly start caring about iteration order
// TODO: Then possibly refactor runmatch to return a list of events to be rendered
const player: Player = {hero: "", level: 0, money: 0, rank: 0, q: 0, xp: 0, skills: []}

console.log(runMatch(player));
console.log(player.q);