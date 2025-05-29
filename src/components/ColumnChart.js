import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ColumnChart({ min, max, val, title }) {
  // Define the data for the chart
  const data = {
    labels: [''], // Empty label for the single column
    datasets: [
      {
        label: '',
        data: [val], // Value for the column
        backgroundColor: 'blue', // Color of the bar
        barThickness: 10,
      },
    ],
  };

  // Define the options for the chart
  const options = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Remove legend
      },
      title: {
        display: true,
        text: title, // Title text
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        min: min, // Minimum value
        max: max, // Maximum value
      },
      x: {
        grid: {
          display: false, // Remove grid lines
        },
        ticks: {
          display: false, // Hide ticks
        },
      },
    },
  };

  return (
    <div
      style={{
        width: '100px',
        height: '300px',
        margin: '50px auto',
        border: '2px solid black',
        
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
}

export default ColumnChart;
