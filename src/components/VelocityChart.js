import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const VelocityChart = ({ velocityData, timeData }) => {
  const data = {
    labels: timeData, // Time data on x-axis
    datasets: [
      {
        label: 'Velocity over Time',
        data: velocityData,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
    ],
  };
  const options = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Velocity vs Time',
      },
    },
  };
  return <div style={{
    width: '800px',
    height: '450px',
    margin: '50px auto',
    border: '2px solid black',
  }}
  >
     <Line data={data} options={options}/>
     </div>;
};
export default VelocityChart;