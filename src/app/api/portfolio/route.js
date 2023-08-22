import { NextResponse } from "next/server";

import axios from "axios";
import fs from "fs";

import path from "path";

let directory = path.join(process.cwd(), 'json');
let portfolio = new Array();

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let address = searchParams.get('address');
    
    const [strategies, shareholders_bystrategy] = await Promise.all([
      fs.promises.readFile(path.join(directory, 'strategies.json'), 'utf-8').then(JSON.parse),
      fs.promises.readFile(path.join(directory, 'shareholders_bystrategy.json'), 'utf-8').then(JSON.parse)
    ]);
  
    portfolio = strategies.reduce((result, strategy) => {
      const shareholderData = shareholders_bystrategy.find(item => item.strategy === strategy.address);
      if (shareholderData && shareholderData.shareholders.length > 0) {
        const recentShareholders = shareholderData.shareholders[shareholderData.shareholders.length - 1].uniqueWallets;
        const isShareholder = recentShareholders.includes(address);
        result.push({ strategy: strategy.address, isShareholder });
      }
      return result;
    }, []);
    portfolio = portfolio.filter(function (el) {
      return el != null;
    });
    await get_pnl(address);
    let leaderboard = JSON.parse(fs.readFileSync(directory + "/" + 'leaderboard.json', 'utf-8'));
    let leaderboardMap = Object.fromEntries(leaderboard.map(item => [item.strategy, item]));
  
    for (const strategy of portfolio) {
      let leaderboardItem = leaderboardMap[strategy.strategy];
      if (leaderboardItem) {
        strategy.tokenAMetadata = leaderboardItem.tokenAMetadata;
        strategy.tokenBMetadata = leaderboardItem.tokenBMetadata;
      }
    }
    return NextResponse.json({ portfolio }, { status: 200 });
  } catch (error) {
    console.log(error)
  }
}

async function get_pnl(shareholder) {
  for (const strategy of portfolio) {
    let address = strategy.strategy;
    let current = `https://api.hubbleprotocol.io/strategies/${address}/shareholders/${shareholder}/pnl?env=mainnet-beta`;
    let history = `https://api.hubbleprotocol.io/strategies/${address}/shareholders/${shareholder}/pnl/history?env=mainnet-beta`;

    strategy.position = {};

    try {
      const [currentResponse, historyResponse] = await Promise.all([
        axios.get(current),
        axios.get(history)
      ]);

      strategy.position.current = currentResponse.data;
      strategy.position.history = historyResponse.data;
    } catch (error) {
      console.log(error);
    }
  }
}