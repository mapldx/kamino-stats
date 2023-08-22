import { useState } from 'react';
import numeral from 'numeral';

const Leaderboard = ({ leaderboard }) => {
  leaderboard = leaderboard.filter((item) => parseFloat(item.volume) > 1);

  const filteredLeaderboard = leaderboard.filter((item) => parseFloat(item.volume) > 1);
  const [sortedLeaderboard, setSortedLeaderboard] = useState(filteredLeaderboard);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

    const sorted = [...sortedLeaderboard].sort((a, b) => {
      const valA = parseFloat(a[field]);
      const valB = parseFloat(b[field]);
      return direction === 'asc' ? valA - valB : valB - valA;
    });

    setSortedLeaderboard(sorted);
    setSortField(field);
    setSortDirection(direction);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Leaderboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of the top performing strategies sorted by PnL
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Vault Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Strategy</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <button onClick={() => handleSort('apy')}>APY (%) {sortField === 'apy' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</button>
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <button onClick={() => handleSort('pnl')}>P&L (%) {sortField === 'pnl' ? (sortDirection === 'asc' ? '↑' : '↓') : '↓'}</button>
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    <button onClick={() => handleSort('volume')}>Volume (USD) {sortField === 'volume' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</button>
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-3 text-left text-sm font-semibold text-gray-900">
                    <button onClick={() => handleSort('fees')}>Fees (USD) {sortField === 'fees' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {sortedLeaderboard.map((item) => (
                  <tr key={item.strategy} className="even:bg-gray-50 text-gray-600">
                    {item.tokenAMint && item.tokenBMint ?
                      <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 flex items-center">
                        <img src={item.tokenAMetadata?.image || item.tokenAMetadata?.logoURI || item.tokenAMetadata?.icon} className="w-auto h-4 mr-2" />
                        {item.tokenAMetadata.symbol}&nbsp;-&nbsp;
                        <img src={item.tokenBMetadata?.image || item.tokenBMetadata?.logoURI || item.tokenBMetadata?.icon} className="w-auto h-4 mr-2" />
                        {item.tokenBMetadata.symbol}
                      </td>
                      : <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">(unable to retrieve)</td>}
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{item.strategy.substr(0, 25) + '...'}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{(parseFloat(item.apy) * 100).toFixed(2)}%</td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{(parseFloat(item.pnl) * 100).toFixed(7)}%</td>
                    <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">${numeral(parseFloat(item.volume)).format('0,0.00')}</td>
                    <td className="whitespace-nowrap py-2 pl-3 pr-4 text-sm font-medium sm:pr-3">${numeral(parseFloat(item.fees)).format('0,0.00')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;