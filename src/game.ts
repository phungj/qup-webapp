import {CoinResult, flipCoin} from "@/src/coin";
import {Player} from "@/src/player";
import {buildSkillMap} from "@/src/skills";

export type FlipContext = {
    result: CoinResult;
    playerSide: CoinResult;
    qDelta: number;
};

function runMatch(player: Player) {
    const playerSide = flipCoin();

    let qCount = 0;
    let upCount = 0;

    while (qCount < 3 && upCount < 3) {
        if (runFlip(player, playerSide) === CoinResult.Q) {
            qCount += 1;
        } else {
            upCount += 1;
        }
    }

    return { qCount, upCount, winningSide: playerSide };
}

function runFlip(player: Player, playerSide: CoinResult): CoinResult {
    const context: FlipContext = {
        result: flipCoin(),
        playerSide: playerSide,
        qDelta: 0
    };

    if (context.result === context.playerSide) {
        context.qDelta += 1;
    } else {
        context.qDelta -= 1;

        // context.ratingDelta -= Math.max(1, 0.2 * player.rating);
    }

    const grid = buildSkillMap(player.skills);

    for (const skill of grid.values()) {
        skill.onFlip?.(context, skill, grid);
    }

    player.q = Math.max(0, player.q + context.qDelta);

    return context.result;
}

// TODO: Implement Leila Focus, Luke Double Down and Raise the Stakes, HyperQbe React, Quetzalcoatl Qbit
// TODO: Look at other interesting skills
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