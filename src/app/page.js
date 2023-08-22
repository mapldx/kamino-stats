"use client";

import axios from 'axios';
import { useState, useEffect } from 'react';

import Header from '@/components/header';
import Stats from '../components/stats';

import TVLChart from '@/components/charts/tvl';
import DepositorChart from '@/components/charts/depositor';
import FeesChart from '@/components/charts/fees';
import VolumeChart from '@/components/charts/volume';

import Leaderboard from '@/components/leaderboard';

function HomePage() {
  const [data, setData] = useState(null);
  const [depositorData, setDepositorData] = useState(null);
  const [feesData, setFeesData] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.ENDPOINT_URL}/tvl?sort=date`).then(function (response) {
      setData(response.data.data);
    });
    axios.get(`${process.env.ENDPOINT_URL}/depositor?sort=date`).then(function (response) {
      setDepositorData(response.data);
    });
    axios.get(`${process.env.ENDPOINT_URL}/fees?sort=date`).then(function (response) {
      setFeesData(response.data.data);
    });
    axios.get(`${process.env.ENDPOINT_URL}/volume?sort=date`).then(function (response) {
      setVolumeData(response.data.data);
    });
    axios.get(`${process.env.ENDPOINT_URL}/leaderboard?view=true`).then(function (response) {
      setLeaderboard(response.data.json);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="grid grid-cols-2 gap-4 px-24">
        <div className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <p className="text-base font-semibold leading-7 text-indigo-600">Welcome to kamino.one — your home for Kamino Analytics!</p>
              <h2 className="mt-2 text-5xl font-bold tracking-tight text-gray-900">Make informed decisions based on live protocol data</h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Kamino Finance is the leading liquidity yield aggreggator on Solana. Utilize kamino.one to extract insights on the protocol and your portfolio.
              </p>
            </div>
          </div>
        </div>
        <div className="py-12 sm:py-16">
          <Stats />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-24">
        <div>
          {data ? <TVLChart tvl_bydate={data} /> : (
            <div className="flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        <div>
          {depositorData ? <DepositorChart wallets_bydate={depositorData} /> : (
            <div className="flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-24 py-16">
        <div>
          {feesData ? <FeesChart feesByDate={feesData} /> : (
            <div className="flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        <div>
          {volumeData ? <VolumeChart volume_bydate={volumeData} /> : (
            <div className="flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-900 px-6 mt-12 mb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">Discover strategies</h2>
          <p className="mt-6 text-md leading-8 text-gray-300">
            As automated management strategies, Kamino Vaults are designed to maximize yield while removing the need to actively maintain a CLMM position.
          </p>
        </div>
        <div className="px-24 mt-12">
          {leaderboard ? <Leaderboard leaderboard={leaderboard} /> : 'Loading...'}
        </div>
      </div>
    </>
  );
}

export default HomePage;