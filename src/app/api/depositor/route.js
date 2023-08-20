import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";

import { Kamino } from '@hubbleprotocol/kamino-sdk';
import { Connection } from '@solana/web3.js';
import Decimal from 'decimal.js';

const CLUSTER_URL = 'https://rpc.helius.xyz/?api-key=0ce5ed50-04ac-4e67-95e0-ecab50b041aa';

let strategies = new Array();
let shareholders_bystrategy = new Array();
let shareholders_bydate = new Array();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('sort') == "strategy") {
    let data = JSON.parse(fs.readFileSync('shareholders_bystrategy.json', 'utf-8'));
    return NextResponse.json({ data }, { status: 200 });
  } else if (searchParams.get('sort') == "date") {
    let data = JSON.parse(fs.readFileSync('shareholders_bydate.json', 'utf-8'));
    return NextResponse.json({ data }, { status: 200 });
  }
  if (searchParams.get('today') == "true") {
    let json = JSON.parse(fs.readFileSync('shareholders_bydate.json', 'utf-8'));
    let shareholdersToday = json[Object.keys(json)[Object.keys(json).length - 1]].length;
    let shareholdersYesterday = json[Object.keys(json)[Object.keys(json).length - 2]].length;
    console.log(json[Object.keys(json)[Object.keys(json).length - 1]]);
    let data = {
      today: shareholdersToday,
      yesterday: shareholdersYesterday,
      change: (((shareholdersToday - shareholdersYesterday) / shareholdersYesterday) * 100).toPrecision(2) + "%",
    }
    return NextResponse.json({ data }, { status: 200 });
  }
  await get_strategies();
  await Promise.all(strategies.map(async (strategy) => {
    await get_shareholders(strategy);
  }));

  return NextResponse.json({ shareholders_bydate }, { status: 200 });
}

async function get_strategies() {
  await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta')
    .then(function (response) {
      (response.data).forEach(element => {
        strategies.push(element.address);
      });
    })
}

async function get_shareholders(strategy) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const date = currentDate.toISOString().substring(0, 10);

  await axios.get(`https://api.hubbleprotocol.io/strategies/${strategy}/shareholders/history?env=mainnet-beta&start=2023-01-01&end=${date}&frequency=day`)
    .then(function (response) {
      let data = response.data;
      const uniqueWalletsPerDay = data.map((entry) => {
        const wallets = entry.shareholders.map((shareholder) => shareholder.wallet);
        const uniqueWallets = [...new Set(wallets)];
        return {
          timestamp: entry.timestamp,
          uniqueWallets: uniqueWallets,
        };
      });
      let nested = {
        strategy: strategy,
        shareholders: uniqueWalletsPerDay,
      };
      shareholders_bystrategy.push(nested);
      fs.writeFileSync('shareholders_bystrategy.json', JSON.stringify(shareholders_bystrategy));

      let shareholders = {};
      shareholders_bystrategy.forEach(strategy => {
        strategy.shareholders.forEach(shareholder => {
          const timestamp = shareholder.timestamp;

          if (!shareholders[timestamp]) {
            shareholders[timestamp] = new Set();
          }
          shareholder.uniqueWallets.forEach(wallet => {
            shareholders[timestamp].add(wallet);
          });
        });
      });

      for (const timestamp in shareholders) {
        shareholders[timestamp] = [...shareholders[timestamp]];
      }

      shareholders_bydate = shareholders;
      const sortedKeys = Object.keys(shareholders_bydate).sort();

      for (const key of sortedKeys) {
        const value = shareholders_bydate[key];
        delete shareholders_bydate[key];
        shareholders_bydate[key] = value;
      }
      fs.writeFileSync('shareholders_bydate.json', JSON.stringify(shareholders_bydate));
    })
}