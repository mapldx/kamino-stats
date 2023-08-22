import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";

const strategies = [];
const volumeByDate = [];

// provides for the following routes: /api/volume, /api/volume?sort=strategy, /api/volume?sort=date, /api/volume?today=true
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('today') == "true") {
    let json = JSON.parse(fs.readFileSync(process.env.FS_DIRECTORY + "/" +'volume_bydate.json', 'utf-8'));
    let volumeToday;
    await axios.get('https://api.hubbleprotocol.io/strategies/all-time-volume?env=mainnet-beta')
      .then(function (response) {
        volumeToday = response.data.volumeUsd;
      })
      .catch(function (error) {
        volumeToday = json[json.length - 1].cumulativeVolume;
      });
    let change = (json[json.length - 1].volume24hUsd - json[json.length - 2].volume24hUsd) / json[json.length - 2].volume24hUsd * 100 + "%";
    let data = {
      today: volumeToday,
      change: change,
    }
    return NextResponse.json({ data }, { status: 200 });
  }
  if (searchParams.get('sort') == "strategy") {
    // let data = JSON.parse(fs.readFileSync(process.env.FS_DIRECTORY + "/" +'volume_bystrategy.json', 'utf-8'));
    // return NextResponse.json({ data }, { status: 200 });
  } else if (searchParams.get('sort') == "date") {
    let data = JSON.parse(fs.readFileSync(process.env.FS_DIRECTORY + "/" +'volume_bydate.json', 'utf-8'));
    return NextResponse.json({ data }, { status: 200 });
  }
  await get_strategies();
  await Promise.all(strategies.map(async (strategy) => {
    await get_volume(strategy);
  }));
  volumeByDate.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  let cumulativeVolume = 0;
  volumeByDate.forEach((entry, index) => {
    cumulativeVolume += entry.volume24hUsd;
    volumeByDate[index].cumulativeVolume = cumulativeVolume;
  });
  fs.writeFileSync(process.env.FS_DIRECTORY + "/" +'volume_bydate.json', JSON.stringify(volumeByDate));
  return NextResponse.json({ volumeByDate }, { status: 200 });
}

async function get_strategies() {
  await axios.get('https://api.hubbleprotocol.io/strategies/enabled?env=mainnet-beta')
    .then(function (response) {
      (response.data).forEach(element => {
        strategies.push(element.address);
      });
    })
}

async function get_volume(strategy) {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const date = currentDate.toISOString().substring(0, 10);

  await axios.get(`https://api.hubbleprotocol.io/strategies/${strategy}/metrics/history?env=mainnet-beta&start=2001-01-01&end=${date}`)
    .then(function (response) {
      response.data.forEach(entry => {
        if (entry.date.endsWith("00:00:00.000Z")) {
          const date = entry.date.slice(0, 10);
          const index = volumeByDate.findIndex(d => d.date === date);

          if (index === -1) {
            volumeByDate.push({
              date,
              volume24hUsd: parseFloat(entry.volume24hUsd),
            });
          } else {
            volumeByDate[index].volume24hUsd += parseFloat(entry.volume24hUsd);
          }
        }
      });
    })
}