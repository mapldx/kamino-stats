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
    if (!shareholderData) return null;

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
  await get_pnl(address);
  portfolio = await interpret_strategy();
  return NextResponse.json({ portfolio }, { status: 200 });
}

async function get_strategies() {
  let json = JSON.parse(fs.readFileSync(process.env.FS_DIRECTORY + "/" +'strategies.json', 'utf-8'));
  return json;
}

async function get_shareholders() {
  let json = JSON.parse(fs.readFileSync(process.env.FS_DIRECTORY + "/" +'shareholders_bystrategy.json', 'utf-8'));
  return json;
}

async function get_strategy(strategy) {
  // TODO: update all get_strategies to utilize local file and create a method to sync this local file with the API with just one call
  // let response = await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta');
  // let strategies = response.data;
  let strategies = await JSON.parse(fs.readFileSync(process.env.FS_DIRECTORY + "/" +'strategies.json', 'utf-8'));
  for (const element of strategies) {
    if (element.address === strategy) {
      return {
        a: element.tokenAMint || null,
        b: element.tokenBMint || null
      };
    }
  }
}

async function get_pnl(shareholder) {
  for (const strategy of portfolio) {
    let address = strategy.strategy;
    let current = `https://api.hubbleprotocol.io/strategies/${address}/shareholders/${shareholder}/pnl?env=mainnet-beta`;
    let history = `https://api.hubbleprotocol.io/strategies/${address}/shareholders/${shareholder}/pnl/history?env=mainnet-beta`;
    strategy.position = {};
    await axios.get(current)
      .then(async function (pnl) {
        strategy.position.current = pnl.data;
      })
      .catch(function (error) {
      })
    await axios.get(history)
      .then(async function (history) {
        strategy.position.history = history.data;
      })
      .catch(function (error) {
      })
  }
}

async function interpret_strategy() {
  for (const strategy of portfolio) {
    let token = await get_strategy(strategy.strategy);
    try {
      strategy.tokenAMint = token.a;
      strategy.tokenBMint = token.b;
      if (process.env.INTERPRET_WITH == "HELIUS") {
        let data = JSON.stringify({
          "mintAccounts": [
            token.a,
            token.b
          ],
          "includeOffChain": true,
          "disableCache": false
        });
        await axios.post(`https://api.helius.xyz/v0/token-metadata?api-key=${process.env.HELIUS_API_KEY}`, data, {
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
      } else if (process.env.INTERPRET_WITH == "SOLSCAN") {
        let url = `https://api.solscan.io/account?address=${token.a}`;
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: url,
          headers: { 
            'authority': 'api.solscan.io', 
            'accept': 'application/json, text/plain, */*', 
            'accept-language': 'en-US,en;q=0.9', 
            'if-none-match': 'W/"516-wor81cMsDp6r4sky8HMrdt2fGNw"', 
            'origin': 'https://solscan.io', 
            'referer': 'https://solscan.io/', 
            'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Brave";v="116"', 
            'sec-ch-ua-mobile': '?1', 
            'sec-ch-ua-platform': '"Android"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-site', 
            'sec-gpc': '1', 
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36', 
          }
        };
        await axios.request(config)
          .then(async function (tokenA) {
            strategy.tokenAMetadata = tokenA.data.data.tokenInfo;
            url = `https://api.solscan.io/account?address=${token.b}`;
            config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: url,
              headers: { 
                'authority': 'api.solscan.io', 
                'accept': 'application/json, text/plain, */*', 
                'accept-language': 'en-US,en;q=0.9', 
                'if-none-match': 'W/"516-wor81cMsDp6r4sky8HMrdt2fGNw"', 
                'origin': 'https://solscan.io', 
                'referer': 'https://solscan.io/', 
                'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Brave";v="116"', 
                'sec-ch-ua-mobile': '?1', 
                'sec-ch-ua-platform': '"Android"', 
                'sec-fetch-dest': 'empty', 
                'sec-fetch-mode': 'cors', 
                'sec-fetch-site': 'same-site', 
                'sec-gpc': '1', 
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36', 
              }
            };
            await axios.request(config)
              .then(function (tokenB) {
                strategy.tokenBMetadata = tokenB.data.data.tokenInfo;
              })
          })
          .catch(function (error) {
          })
      }
    } catch (error) {
      strategy.tokenAMint = null;
      strategy.tokenBMint = null;
    }
  }
  portfolio = portfolio;
  return portfolio;
}