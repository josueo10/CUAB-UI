import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components
ChartJS.register(ArcElement, Tooltip, Legend);

function DirectionChart({ orientation }) {
  // Data for the Pie chart
  const data = {
    datasets: [
      {
        data: [75, 2], // Values for the pie slices
        backgroundColor: ['blue', 'red']// Colors for the slices
      },
    ],
  };

  // Options for the chart
  const options = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top', // Position of the legend
      },
      title: {
        display: true,
        text: "Direction:", // Title text
        font: {
          size: 16, // Adjust font size
        },
      },
    },
    rotation: 90-orientation // Adjust starting angle based on the orientation
  };

  return (
    <div style={{ width: '200px', height: '200px', border: '2px solid black', margin: '0 auto' }}>
      <Pie data={data} options={options} />
    </div>
  );
}

export default DirectionChart;
