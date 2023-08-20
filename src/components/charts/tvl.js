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
      text: 'Total TVL Chart',
    },
  },
};

function TVLChart({ tvl_bydate }) {
  const labels = tvl_bydate.map(item => item.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Total TVL',
        data: tvl_bydate.map(item => item.totalTvl),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: { target: 'origin', above: 'rgba(255, 99, 132, 0.3)' },
        pointRadius: 1,
        pointHoverRadius: 7,
      },
    ],
  };

  return <Line options={options} data={data} />;
}

export default TVLChart;
