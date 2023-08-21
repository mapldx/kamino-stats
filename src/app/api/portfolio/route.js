import { NextResponse } from "next/server";

import axios from "axios";
import fs from "fs";

let portfolio = new Array();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let address = searchParams.get('address');

  const strategies = await get_strategies();
  const shareholders_bystrategy = await get_shareholders();

  const result = strategies.map(strategy => {
    const shareholderData = shareholders_bystrategy.find(item => item.strategy === strategy.address);
    if (!shareholderData) return null; // Skip if no matching data

    if (shareholderData.shareholders.length > 0) {
      const recentShareholders = shareholderData.shareholders[shareholderData.shareholders.length - 1].uniqueWallets;
      const isShareholder = recentShareholders.includes(address);
      let data = {
        strategy: strategy.address,
        isShareholder
      };
      portfolio.push(data);
    }
  })
  portfolio = portfolio.filter(function (el) {
    return el != null;
  });
  portfolio = await interpret_strategy();
  return NextResponse.json({ portfolio }, { status: 200 });
}

async function get_strategies() {
  let json = JSON.parse(fs.readFileSync('strategies.json', 'utf-8'));
  return json;
}

async function get_shareholders() {
  let json = JSON.parse(fs.readFileSync('shareholders_bystrategy.json', 'utf-8'));
  return json;
}

async function get_strategy(strategy) {
  // TODO: update all get_strategies to utilize local file and create a method to sync this local file with the API with just one call
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

async function interpret_strategy() {
  for (const strategy of portfolio) {
    let token = await get_strategy(strategy.strategy);
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
      await axios.post('https://api.helius.xyz/v0/token-metadata?api-key=86a8a9bb-990d-4f36-bbe9-2b3921708b4c', data, {
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
  portfolio = portfolio;
  return portfolio;
}