import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";

let leaderboard = new Array();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('view') == "true") {
    let json = JSON.parse(fs.readFileSync('leaderboard.json', 'utf-8'));
    return NextResponse.json({ json }, { status: 200 });
  }
  await get_leaderboard();
  await interpret_strategy();
  fs.writeFileSync('leaderboard.json', JSON.stringify(leaderboard));
  return NextResponse.json({ leaderboard }, { status: 200 });
}

async function get_leaderboard() {
  await axios.get('https://api.hubbleprotocol.io/strategies/leaderboard?env=mainnet-beta&period=7d')
    .then(function (response) {
      leaderboard = response.data.strategies;
    })
}

async function interpret_strategy() {
  for (const strategy of leaderboard) {
    let token = await get_strategies(strategy.strategy);
    try {
      strategy.tokenAMint = token.a;
      strategy.tokenBMint = token.b;
      let data = JSON.stringify({
        "mintAccounts": [
          token.a,
          token.b
        ],
        "includeOffChain": true,
        "disableCache": false
      });
      await axios.post('https://api.helius.xyz/v0/token-metadata?api-key=0ce5ed50-04ac-4e67-95e0-ecab50b041aa', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        let tokenA = response.data[0];
        let tokenB = response.data[1];
        strategy.tokenAMetadata = tokenA.offChainMetadata.metadata;
        strategy.tokenBMetadata = tokenB.offChainMetadata.metadata;
        if (strategy.tokenAMetadata == null) {
          strategy.tokenAMetadata = tokenA.legacyMetadata;
        }
        if (strategy.tokenBMetadata == null) {
          strategy.tokenBMetadata = tokenB.legacyMetadata;
        }
      });
    } catch (error) {
      strategy.tokenAMint = null;
      strategy.tokenBMint = null;
    }
  }
}

async function get_strategies(strategy) {
  // let response = await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta');
  // let strategies = response.data;
  let strategies = await JSON.parse(fs.readFileSync('strategies.json', 'utf-8'));
  for (const element of strategies) {
    if (element.address === strategy) {
      return {
        a: element.tokenAMint || null,
        b: element.tokenBMint || null
      };
    }
  }
}