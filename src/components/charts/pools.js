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

const LineChart = ({ data }) => {
  if (!data || !data.data || !data.data.items) return <div>Error loading data</div>;

  const items = data.data.items;

  const chartData = {
    labels: items.map(item => (item.humanTime).substring(0, 10)),
    datasets: [
      {
        label: 'V',
        data: items.map(item => item.v),
        borderColor: 'rgba(192,75,75,1)',
        backgroundColor: 'rgba(192,75,75,0.5)',
        fill: true,
      },
    ],
  };

  const options = {
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
        text: 'Volume Over Time (USD)',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LineChart;
