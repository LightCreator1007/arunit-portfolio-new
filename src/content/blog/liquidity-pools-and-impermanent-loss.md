---
tag: DEFI
date: 2026-06-29
blurb: Nobody sits on the other side of a decentralized trade. A formula does. Here is how it sets prices, why the people funding it quietly lose money, and how fees and arbitrage square the books.
---

# Liquidity pools, impermanent loss, and the arbitrage that keeps them honest

I spent the last few days working on a bouty by superteam, and since I was quite new to solana ecosystem and DeFi in general, I was quite confused by the jargons and terminology used on the blockchain. Since I was working toward a position-manager-skill for the bounty, I had to first understand the premise, and its genuinely interesting to me how you trade one token for another when nobody in on the other side of the trade? On a normal stock exchange, every buy needs a matching seller. On most onchain exchanges, there is no seller. There is a formula.

## Before this: the order book and its empty rooms

A traditional exchange runs an *order book*: a list of people willing to buy at certain
prices, and people willing to sell at certain prices. A trade happens when a buyer and a
seller agree on a number.

This is wonderful when an asset is popular and both sides of the room are crowded. It is
miserable when an asset is new or rarely traded. You show up wanting to sell, find nobody
waiting to buy, and your order just sits there. The market only works when the room is
full.

## The idea: a vending machine instead of a crowd

An *Automated Market Maker*, or AMM, throws the crowd out and replaces it with a vending
machine. The machine holds a stock of two tokens, call them X and Y. Anyone can drop in
some X and pull out some Y, or the reverse. It never refuses a trade and it never sleeps.

The pile of tokens the machine holds is called a *liquidity pool*. The people who supply
those tokens are *liquidity providers*, which I will shorten to LPs. They are the ones who
fill the machine so other people can trade against it.

So, how does the machine decide the price??

## The constant product formula

The most common rule is actually quite simple. Take the amount of X and the amount of
Y in the pool, multiply them, and keep that product fixed.

```
x * y = k
```

Here `x` is how much of token X sits in the pool, `y` is how much of token Y, and `k` is a
number that does not move during a trade. If you want to take Y out, you must put enough X
in to keep the product equal to `k`.

The price of X, measured in Y, is just the ratio of the two piles:

```
price = y / x
```

This has a lovely little side effect. The more X you buy, the less X is left in the pool, so each
additional unit costs more Y. The machine raises its own price as you drain it. That price
movement against you is called *slippage*, and it is the pool's built-in defense against
being emptied in one go.

A quick worked example. Say the pool holds 10 X and 1000 Y, so `k = 10000` and X starts at
a price of 100 Y. You buy X with 100 Y:

```
new y = 1000 + 100      = 1100
new x = k / new y        = 10000 / 1100 = 9.09
x received = 10 - 9.09   = 0.91
```

You paid 100 Y for 0.91 X, an average of about 110 Y each, even though the price started at
100. That gap is slippage, and it grows with the size of your trade.

## Arbitrage drags the price back to reality

Here is the clever part. The formula has no idea what anything is
actually worth. It only knows its own ratio. So what stops the pool from being out of sync
from the rest of the world?

Arbitrage. An *arbitrageur* buys where something is cheap and sells where it is expensive,
pocketing the difference. If the pool prices X at 90 Y while every other exchange says 100,
an arbitrageur buys X out of the pool until the pool's ratio climbs back to 100. They do
this purely for profit, but the side effect is that the pool's price gets dragged back in
line with the wider market.

The reason behind the pool staying honest is not that it actively watches the market, but because traders cannot
leave a mispricing alone. It's wild how the pool stays in sync out of human greed :O .
## Impermanent loss, the hidden tax on LPs

Being a liquidity provider must sound like free money right? deposit two
tokens, collect a slice of every trade. But there is a hidden cost called *impermanent
loss* (ofc there is), and it took me a while to actually feel why it exists.

Impermanent loss is the gap between what your tokens are worth sitting in the pool versus
what they would have been worth if you had just held them in your wallet.

When X rises, arbitrageurs buy X out of the pool on the way up. The pool is
selling your winner cheaply the whole climb, so you end up holding more of the token that
fell and less of the token that rose. The machine automatically sells your winners and
buys your losers. Had you simply held, you would have kept all of the winner.

For a constant product pool the math is clean. If one token's price changes by a factor
`r` relative to the other (so `r = 2` means it doubled), your position compared to just
holding is worth:

```
value ratio = 2 * sqrt(r) / (1 + r)
```

And impermanent loss is one minus that:

```
IL = 1 - 2 * sqrt(r) / (1 + r)
```

A few numbers make it concrete:

```
r = 1     (no change)      IL = 0%
r = 1.25  (up 25%)         IL = 0.6%
r = 2     (price doubles)  IL = 5.7%
r = 4     (price 4x)       IL = 20%
r = 0.5   (price halves)   IL = 5.7%
```

Notice it is symmetric - a doubling and a halving sting the same. And notice it stays small
for small moves but bites hard on big ones. It is called *impermanent* because if the price
wanders back to where you started, the loss disappears. It only becomes permanent when you
withdraw while the price is away from your entry point.

## How fees cover it

So why does anyone provide liquidity? Fees. Every trade pays a small cut, often around 0.3
percent, split among the LPs by their share of the pool. The bet an LP is making is just:

```
fees earned > impermanent loss
```

A volatile pair with heavy trading can throw off enough fees to comfortably outrun its
impermanent loss. A pair that rockets in one direction and rarely trades can leave LPs
underwater. There is no guarantee. Providing liquidity is an active bet that volume will
pay you more than price divergence will cost you.

## Concentrated liquidity: standing in one spot

Here is the inefficiency that bugged the early AMMs. In the `x * y = k` design, your
liquidity is smeared across every possible price from zero to infinity. But almost all
trading happens in a narrow band around the current price. Most of your capital is parked
at prices that may never occur, doing nothing.

A *Concentrated Liquidity Market Maker*, or CLMM, fixes this. Instead of spreading your
tokens across all prices, you pick a range: "provide liquidity only between 90 and 110 Y
per X." All of your capital works inside that band. The curve is the same constant product
shape, just shifted so it only applies within the range you chose.

The payoff is *capital efficiency*. By packing into a tight range you can offer the same
trading depth with a fraction of the money, which means a bigger share of the fees for the
same capital.

The catch cuts both ways. If the price leaves your range, your position stops earning fees
entirely and ends up fully converted into the weaker of the two tokens. Concentration
sharpens both the reward and the impermanent loss. You are no longer a passive vending
machine; you are choosing where to stand, and you pay for guessing wrong. This is why CLMM
positions need tending: set a range, and if the market walks off, you either follow it or
sit idle.

## Final thoughts

AMM is not a clever pricing oracle. It is a dumb
formula, kept honest by arbitrage and funded by fees to provide incentive to LPs because they incurr a loss in comparison to what they would have had if they held (although the loss is impermanent, but it becomes real if they withdraw).

The whole system is three forces leaning against each other. The formula sets the price. Arbitrage drags that price toward the market price. Fees decide whether the people filling
the machine come out ahead.
