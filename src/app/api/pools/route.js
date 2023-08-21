import { NextResponse } from "next/server";

import axios from "axios";
import fs from "fs";

let pools = new Array();
let metadata = new Array();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('search') == 'true') {
    let json = JSON.parse(fs.readFileSync('pools.json', 'utf-8'));
    try {
      for (const item of json) {
        for (const pool of item) {
          if (pool.pool == searchParams.get('pool')) {
            return NextResponse.json({ pool }, { status: 200 });
          }
        }
      }
    } catch (error) {
      // error caught, continue
    }
    await interpret_pool(searchParams.get('pool'));
    json.push(metadata);
    fs.writeFileSync('pools.json', JSON.stringify(json));
    return NextResponse.json({ metadata }, { status: 200 });
  }
  if (searchParams.get('consolidate') == 'true') {
    let json = JSON.parse(fs.readFileSync('pools.json', 'utf-8'));
    await get_pools();
    for (const origin of pools) {
      for (const item of json) {
        for (const pool of item) {
          if (pool.pool == origin.pool) {
            origin.tokenA = pool.tokenA;
            origin.tokenB = pool.tokenB;
          }
        }
      }
    }
    return NextResponse.json({ pools }, { status: 200 });
  }
  await get_pools();
  for (const pool of pools) {
    await axios.get(`http://localhost:3000/api/pools?search=true&pool=${pool.pool}`)
  }
  return NextResponse.json({ pools }, { status: 200 });
}

async function get_pools() {
  await axios.get('https://api.hubbleprotocol.io/whirlpools/tvl')
    .then(function (response) {
      pools = response.data;
    })
}

async function interpret_pool(address) {
  metadata = new Array();
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://api.solscan.io/protocol/address/info?address=${address}&cluster=mainnet-beta`,
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
    .then(function (response) {
      let data = response.data.data;
      let tokenA = data.base;
      let tokenB = data.quote;
      let pool = {
        pool: address,
        tokenA: tokenA,
        tokenB: tokenB,
      }
      metadata.push(pool);
    });
}

