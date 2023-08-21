import { useState } from 'react';
import numeral from 'numeral';

import PoolModal from './pool';

const PoolsTable = ({ pools }) => {
  pools = pools.filter((item) => parseFloat(item.tvl) > 1);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);

  const openModal = (pool) => {
    setModalOpen(true);
    setSelectedPool(pool);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPool(null);
  };

  return (
    <div>
      {isModalOpen && <PoolModal pool={selectedPool} onClose={closeModal} />}
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-3 text-left text-sm font-semibold text-gray-900">
              Pool Name
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-3 text-left text-sm font-semibold text-gray-900">
              Pool Address
            </th>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
              TVL
            </th>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">
              View More?
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {pools.map((item) => (
            <tr key={item.pool} className="even:bg-gray-50 text-gray-600">
              {item.tokenA?.symbol && item.tokenB?.symbol ?
                <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 flex items-center">
                  <img src={item.tokenA.icon} className="w-auto h-4 mr-2" />
                  {item.tokenA.symbol}&nbsp;-&nbsp;
                  <img src={item.tokenB.icon} className="w-auto h-4 mr-2" />
                  {item.tokenB.symbol}
                </td>
                : <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">(unable to retrieve)</td>}
              <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">
                {item.pool.substr(0, 25) + '...'}
              </td>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                ${numeral(parseFloat(item.tvl)).format('0,0.00')}
              </td>
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                <button onClick={() => openModal(item.pool)}>More Stats</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PoolsTable;
