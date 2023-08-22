import { NextResponse } from "next/server";

import axios from "axios";
import fs from "fs";
import path from "path";

let directory = path.join(process.cwd(), 'json');

let strategies = new Array();
let tvl_bystrategy = new Array();
let tvl_bydate = new Array();

// provides for the following routes: /api/tvl, /api/tvl?sort=strategy, /api/tvl?sort=date, /api/tvl?today=true
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('today') == "true") {
    let json = JSON.parse(fs.readFileSync(directory + "/" +'tvl_bydate.json', 'utf-8'));
    let tvlToday = json[json.length - 1].totalTvl;
    let tvlYesterday = json[json.length - 2].totalTvl;
    let data = {
      today: tvlToday,
      yesterday: tvlYesterday,
      change: (((tvlToday - tvlYesterday) / tvlYesterday) * 100).toPrecision(2) + "%",
    }
    return NextResponse.json({ data }, { status: 200 });
  }
  if (searchParams.get('sort') == "strategy") {
    let data = JSON.parse(fs.readFileSync(directory + "/" +'tvl_bystrategy.json', 'utf-8'));
    return NextResponse.json({ data }, { status: 200 });
  } else if (searchParams.get('sort') == "date") {
    let data = JSON.parse(fs.readFileSync(directory + "/" +'tvl_bydate.json', 'utf-8'));
    return NextResponse.json({ data }, { status: 200 });
  }
  await get_strategies();
  await Promise.all(strategies.map(async (strategy) => {
    await get_tvl(strategy);
  }));
  fs.writeFileSync(directory + "/" +'tvl_bystrategy.json', JSON.stringify(tvl_bystrategy));
  fs.writeFileSync(directory + "/" +'tvl_bydate.json', JSON.stringify(tvl_bydate));
  return NextResponse.json({ tvl_bydate }, { status: 200 });
}

async function get_strategies() {
  await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta')
    .then(function (response) {
      (response.data).forEach(element => {
        strategies.push(element.address);
      });
    })
}

async function get_tvl(strategy) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const date = currentDate.toISOString().substring(0, 10);

  await axios.get(`https://api.hubbleprotocol.io/v2/strategies/${strategy}/history?env=mainnet-beta&start=2023-01-01&end=${date}&frequency=day`)
    .then(function (response) {
      (response.data).forEach(element => {
        let data = {
          strategy: strategy,
          timestamp: element.timestamp,
          totalValueLocked: element.totalValueLocked,
          solPrice: element.solPrice,
        }
        tvl_bystrategy.push(data);
        tvl_bydate = tvl_bystrategy.reduce((accumulator, entry) => {
          const date = new Date(entry.timestamp).toISOString().split('T')[0];
          const existingEntry = accumulator.find(item => item.date === date);

          if (existingEntry) {
            existingEntry.totalTvl += parseFloat(entry.totalValueLocked);
          } else {
            accumulator.push({
              date: date,
              totalTvl: parseFloat(entry.totalValueLocked),
              solPrice: parseFloat(entry.solPrice),
            });
          }

          return accumulator;
        }, []);
      });
      tvl_bydate = tvl_bydate.sort((a, b) => new Date(a.date) - new Date(b.date));
    })
}