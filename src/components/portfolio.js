import { useState } from 'react';

const Portfolio = ({ portfolio }) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Portfolio</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of the strategies in your portfolio
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3">Token Pair</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Strategy</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Shareholder?</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {portfolio.map((item) => {
                  if (item.isShareholder || showAll) {
                    return (
                      <tr key={item.strategy} className="even:bg-gray-50 text-gray-600">
                        <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3 flex items-center">
                          <img src={item.tokenAMetadata?.logoURI || item.tokenAMetadata?.image} className="w-auto h-4 mr-2" />
                          {item.tokenAMetadata?.symbol}&nbsp;-&nbsp;
                          <img src={item.tokenBMetadata?.logoURI || item.tokenBMetadata?.image} className="w-auto h-4 mr-2" />
                          {item.tokenBMetadata?.symbol}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{item.strategy.substr(0, 25) + '...'}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500">{item.isShareholder ? '✅' : '❌'}</td>
                      </tr>
                    );
                  }
                  return null;
                })}
              </tbody>
            </table>
            <div className="text-center mt-4"> {/* This is the div to center the button */}
              <button onClick={() => setShowAll(!showAll)} className="bg-blue-600 text-white py-2 px-4 rounded">
                {showAll ? 'Hide non-shareholder strategies' : 'Show all strategies'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;