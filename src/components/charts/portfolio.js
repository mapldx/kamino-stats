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
  data = data.position;

  const timestamps = data.history.history.map(item => new Date(item.timestamp).toLocaleDateString());
  const usdValues = data.history.history.map(item => item.positionValue.usd);
  const solValues = data.history.history.map(item => item.positionValue.sol);

  const chartData = {
    labels: timestamps,
    datasets: [
      {
        label: 'USD Value',
        data: usdValues,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        hoverBorderWidth: 2,
        hoverBorderColor: 'rgba(255,99,132,1)',
      }
    ]
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
        text: 'Position Value Over Time',
      },
    },
  };

  return (
    <Line data={chartData} options={options} />
  );
};

export default LineChart;
