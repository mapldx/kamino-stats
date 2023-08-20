"use client";

import axios from 'axios';
import { useState, useEffect } from 'react';

import Header from '@/components/header';
import Stats from '../components/stats';

import TVLChart from '@/components/charts/tvl';
import DepositorChart from '@/components/charts/depositor';
import FeesChart from '@/components/charts/fees';

function HomePage() {
  const [data, setData] = useState(null);
  const [depositorData, setDepositorData] = useState(null);
  const [feesData, setFeesData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/tvl?sort=date').then(function (response) {
      setData(response.data.data);
    });
    axios.get('http://localhost:3000/api/depositor?sort=date').then(function (response) {
      setDepositorData(response.data);
    });
    axios.get('http://localhost:3000/api/fees?sort=date').then(function (response) {
      setFeesData(response.data.data);
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
          {data ? <TVLChart tvl_bydate={data} /> : 'Loading...'}
        </div>
        <div>
          {depositorData ? <DepositorChart wallets_bydate={depositorData} /> : 'Loading...'}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 px-24 py-16">
        <div>
          {feesData ? <FeesChart feesByDate={feesData} /> : 'Loading...'}
        </div>
      </div>
    </>
  );
}

export default HomePage;