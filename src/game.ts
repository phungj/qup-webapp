import {CoinResult, flipCoin} from "@/src/coin";
import {Player} from "@/src/player";
import {buildSkillMap} from "@/src/skills";

export type FlipContext = {
    result: CoinResult;
    winningSide: CoinResult;
    ratingDelta: number;
};

function runMatch(player: Player) {
    const winningSide = flipCoin();

    let qCount = 0;
    let upCount = 0;

    while (qCount < 3 && upCount < 3) {
        if (runFlip(player, winningSide) === CoinResult.Q) {
            qCount += 1;
        } else {
            upCount += 1;
        }
    }

    return { qCount, upCount, winningSide };
}

function runFlip(player: Player, winningSide: CoinResult): CoinResult {
    const context: FlipContext = {
        result: flipCoin(),
        winningSide,
        ratingDelta: 0
    };

    if (context.result === context.winningSide) {
        context.ratingDelta += 1;
    } else {
        context.ratingDelta -= 1;
    }

    const grid = buildSkillMap(player.skills);

    for (const skill of grid.values()) {
        skill.onFlip?.(context, skill, grid);
    }

    player.rating += context.ratingDelta;

    return context.result;
}

// TODO: Implement a few Mynt skills like pawn, look through wiki and see
// TODO: Test spatial skills
// TODO: Then move onto parsing skill descriptions
// TODO: Then move onto making it a basic web app with the results of runmatch
// TODO: Then possibly start caring about iteration order
// TODO: Then possibly refactor runmatch to return a list of events to be rendered
const player: Player = {hero: "", level: 0, money: 0, ranking: 0, rating: 0, xp: 0, skills: []}

console.log(runMatch(player));
console.log(player.rating);