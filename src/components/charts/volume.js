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
      text: 'Total Volume Chart (USD)',
    },
  },
};

function VolumeChart({ volume_bydate }) {
  volume_bydate = volume_bydate.filter(item => item.date > '2022-12-31');
  const labels = volume_bydate.map(item => item.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Volume',
        data: volume_bydate.map(item => item.volume24hUsd),
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

export default VolumeChart;
