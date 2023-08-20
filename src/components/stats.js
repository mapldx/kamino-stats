import { useEffect, useState } from "react";
import numeral from 'numeral';
import axios from "axios";

export default function Stats() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [depositorData, setDepositorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tvl', {
          params: {
            today: true,
          },
        });
        setData(response.data);
        const depositorResponse = await axios.get('http://localhost:3000/api/depositor', {
          params: {
            today: true,
          },
        });
        setDepositorData(depositorResponse.data);
      } catch (err) {
        console.error(err);
        setError(err);
      }
    };
  
    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <article className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6 mb-5">
          <div>
            <p className="text-sm text-gray-500">Total Value Locked (TVL)</p>
            {data ? <p className="text-2xl font-medium text-gray-900">${numeral(data.data.today).format('0.00a')}</p> : 'Loading...'}
          </div>
          <div className="inline-flex gap-2 rounded bg-green-100 p-1 text-green-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {data ? <p className="text-xs font-medium bg-green-500">{data.data.change}</p> : ''}
          </div>
        </article>

        <article
          className="flex items-end justify-between rounded-lg border border-gray-100 bg-white p-6"
        >
          <div>
            <p className="text-sm text-gray-500">Total Depositors</p>

            {depositorData ? <p className="text-2xl font-medium text-gray-900">{numeral(depositorData.data.today).format('0,0')}</p> : 'Loading...'}
          </div>

          <div className="inline-flex gap-2 rounded bg-red-100 p-1 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>

            {depositorData ? <p className="text-xs font-medium">{depositorData.data.change}</p> : ''}
          </div>
        </article>
      </div>
    </div>
  )
}
