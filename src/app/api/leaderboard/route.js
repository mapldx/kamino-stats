import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

let leaderboard = new Array();
let directory = path.join(process.cwd(), 'json');

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('view') == "true") {
    let json = JSON.parse(fs.readFileSync(directory + "/" +'leaderboard.json', 'utf-8'));
    return NextResponse.json({ json }, { status: 200 });
  }
  await get_leaderboard();
  await interpret_strategy();
  fs.writeFileSync(directory + "/" +'leaderboard.json', JSON.stringify(leaderboard));
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
}

async function get_strategies(strategy) {
  // TODO: update all get_strategies to utilize local file and create a method to sync this local file with the API with just one call
  // let response = await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta');
  // let strategies = response.data;
  let strategies = await JSON.parse(fs.readFileSync(directory + "/" +'strategies.json', 'utf-8'));
  for (const element of strategies) {
    if (element.address === strategy) {
      return {
        a: element.tokenAMint || null,
        b: element.tokenBMint || null
      };
    }
  }
}

