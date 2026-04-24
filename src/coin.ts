export const CoinResult = {
    Q: "Q",
    UP: "UP"
} as const;

export type CoinResult = typeof CoinResult[keyof typeof CoinResult];

export const CoinVisualState = {
    Idle: "Idle",
    Flipping: "Flipping",
    Revealed: "Revealed"
} as const;

export type CoinVisualState =
    typeof CoinVisualState[keyof typeof CoinVisualState];

export function flipCoin(): CoinResult {
    return Math.random() < 0.5 ? CoinResult.Q : CoinResult.UP;
}