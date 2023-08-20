import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  scales: {
    x: {
      type: 'category',
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Daily Fees & Rewards (USD)',
    },
  },
};

function FeesChart({ feesByDate }) {
  const dates = feesByDate.map(d => d.date);
  const fees = feesByDate.map(d => d.feesAndRewards24hUsd);

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Daily Fees (USD)',
        data: fees,
        borderColor: 'rgb(30, 144, 255)',
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        fill: { target: 'origin', above: 'rgba(30, 144, 255, 0.3)' },
        pointRadius: 1,
        pointHoverRadius: 7,
      }
    ]
  };

  return <Line options={options} data={data} />;
}

export default FeesChart;
