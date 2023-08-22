import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import path from "path";

let directory = path.join(process.cwd(), 'json');

const strategies = [];
const feesByDate = [];

// provides for the following routes: /api/fees, /api/fees?sort=strategy, /api/fees?sort=date, /api/fees?today=true
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('today') == "true") {
    let json = JSON.parse(fs.readFileSync(directory + "/" +'fees_bydate.json', 'utf-8'));
    let feesToday;
    await axios.get('https://api.hubbleprotocol.io/strategies/all-time-fees-and-rewards')
      .then(function (response) {
        feesToday = response.data.totalUsd;
      })
      .catch(function (error) {
        feesToday = json[json.length - 1].cumulativeFeesAndRewardsUsd;
      });
    let change = json[json.length - 1].feesAndRewards24hUsd;
    let data = {
      today: feesToday,
      change: change,
    }
    return NextResponse.json({ data }, { status: 200 });
  }
  if (searchParams.get('sort') == "strategy") {
    // let data = JSON.parse(fs.readFileSync(directory + "/" +'fees_bystrategy.json', 'utf-8'));
    // return NextResponse.json({ data }, { status: 200 });
  } else if (searchParams.get('sort') == "date") {
    let data = JSON.parse(fs.readFileSync(directory + "/" +'fees_bydate.json', 'utf-8'));
    return NextResponse.json({ data }, { status: 200 });
  }
  await get_strategies();
  await Promise.all(strategies.map(async (strategy) => {
    await get_fees(strategy);
  }));
  feesByDate.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });
  fs.writeFileSync(directory + "/" +'fees_bydate.json', JSON.stringify(feesByDate));
  return NextResponse.json({ feesByDate }, { status: 200 });
}

async function get_strategies() {
  await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta')
    .then(function (response) {
      (response.data).forEach(element => {
        strategies.push(element.address);
      });
    })
}

async function get_fees(strategy) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const date = currentDate.toISOString().substring(0, 10);

  await axios.get(`https://api.hubbleprotocol.io/strategies/${strategy}/metrics/history?env=mainnet-beta&start=2023-01-01&end=${date}`)
    .then(function (response) {
      response.data.forEach(entry => {
        if (entry.date.endsWith("00:00:00.000Z")) {
          const date = entry.date.slice(0, 10);
          const index = feesByDate.findIndex(d => d.date === date);

          if (index === -1) {
            feesByDate.push({
              date,
              feesAndRewards24hUsd: parseFloat(entry.feesAndRewards24hUsd),
              cumulativeFeesAndRewardsUsd: parseFloat(entry.cumulativeFeesAndRewardsUsd)
            });
          } else {
            feesByDate[index].feesAndRewards24hUsd += parseFloat(entry.feesAndRewards24hUsd);
            feesByDate[index].cumulativeFeesAndRewardsUsd += parseFloat(entry.cumulativeFeesAndRewardsUsd);
          }
        }
      });
    })
}