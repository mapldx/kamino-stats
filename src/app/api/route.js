import { NextResponse } from "next/server";

import axios from "axios";
const url = process.env.ENDPOINT_URL;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get('refresh') == "true") {
    const endpoints = [
      `${url}/depositor`,
      `${url}/fees`,
      `${url}/tvl`,
      `${url}/volume`,
      `${url}/leaderboard`
    ];
  
    await Promise.all(endpoints.map(async (endpoint) => {
      await axios.get(endpoint);
    }));
    return NextResponse.json({ message: "OK" }, { status: 200 });
  }
  return NextResponse.json({ message: "NULL" }, { status: 200 });
}