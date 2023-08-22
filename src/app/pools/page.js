"use client";

import axios from 'axios';
import { useState, useEffect } from 'react';

import Header from '@/components/header';
import Pools from '@/components/pools';

function HomePage() {
  const [pools, setPools] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.ENDPOINT_URL}/pools?consolidate=true`).then(function (response) {
      setPools(response.data.pools);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-900 px-6 mt-12 mb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white"><i>Dive</i> into pools</h2>
          <p className="mt-6 text-md leading-8 text-gray-300">
            While historical data is not indicative of future performance, it remains a key factor of consideration for individuals of different risk tolerances and investment strategies. Sift with ease the historical data of dozens of pools across Raydium and Orca.
          </p>
        </div>
        <div className="mt-12 px-24">
          {pools ? <Pools pools={pools} /> : (
            <div className="flex justify-center items-center">
              <div className="spinner"></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;