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
      text: 'Total Depositors Chart',
    },
  },
};

function DepositorChart({ wallets_bydate }) {
  const dates = Object.keys(wallets_bydate.data);
  const depositorsCount = dates.map(date => wallets_bydate.data[date].length);

  dates.forEach(date => {
    dates[dates.indexOf(date)] = date.substring(0, 10);
  });
  
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Number of Depositors',
        data: depositorsCount,
        borderColor: 'rgb(30, 144, 255)',
        backgroundColor: 'rgba(30, 144, 255, 0.2)',
        fill: { target: 'origin', above: 'rgba(30, 144, 255, 0.3)' },
        pointRadius: 1,
        pointHoverRadius: 7,
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default DepositorChart;
