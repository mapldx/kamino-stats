"use client";

import axios from 'axios';
import { useState, useEffect } from 'react';

import Header from '@/components/header';
import Pools from '@/components/pools';

function HomePage() {
  const [pools, setPools] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/api/pools?consolidate=true').then(function (response) {
      setPools(response.data.pools);
    });
  }, []);

  return (
    <>
      <Header />
      <div className="bg-gray-900 px-6 mt-12 mb-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">Find your optimal pool</h2>
          <p className="mt-6 text-md leading-8 text-gray-300">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
            fugiat veniam occaecat fugiat aliqua.
          </p>
        </div>
        <div className="mt-12 px-24">
          {pools ? <Pools pools={pools} /> : 'Loading...'}
        </div>
      </div>
    </>
  );
}

export default HomePage;