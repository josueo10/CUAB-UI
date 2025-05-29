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

// Register required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ThrusterChart({ sL, sR }) {
  // Data for the bar chart
  const data = {
    labels: ['sL', 'sR'], // Labels for x-axis
    datasets: [
      {
        label: 'Thruster Strength', // Label for the dataset
        data: [sL, sR], // Values for sL and sR
        backgroundColor: ['blue', 'blue'], // Colors for the bars
      },
    ],
  };

  // Plugin to draw custom strip lines
  const stripLinePlugin = {
    id: 'stripLinePlugin',
    afterDraw: (chart) => {
      const { ctx, chartArea, scales } = chart;
      if (!chartArea) return; // Skip if chartArea is not available

      const yScale = scales.y;

      // Define strip lines
      const stripLines = [
        { value: 1500, color: 'orange', label: '' },
        { value: 1100, color: 'red', label: 'Reverse' },
        { value: 1900, color: 'green', label: 'Forward' },
      ];

      stripLines.forEach((line) => {
        const y = yScale.getPixelForValue(line.value);

        // Draw line
        ctx.save();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartArea.left, y);
        ctx.lineTo(chartArea.right, y);
        ctx.stroke();
        ctx.restore();

        // Draw label
        ctx.fillStyle = line.color;
        ctx.font = '12px Arial';
        ctx.fillText(
          line.label,
          chartArea.left + 5, // Position near the y-axis
          y - 5 // Slightly above the line
        );
      });
    },
  };

  // Options for the chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Thruster Strengths',
        font: {
          size: 16,
        },
      },
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `Strength: ${context.raw}`, // Customize tooltip label
        },
      },
    },
    scales: {
      y: {
        min: 1000, // Minimum value for y-axis
        max: 2000, // Maximum value for y-axis
        ticks: {
          stepSize: 100, // Interval between ticks
        },
      },
      x: {
        grid: {
          display: false, // Remove grid lines
        },
        ticks: {
          font: {
            size: 16, // Font size for x-axis labels
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        width: '500px',
        height: '300px', // Adjust the chart height
        margin: '50px auto', // Center the chart
        border: '2px solid black',
      }}
    >
      <Bar data={data} options={options} plugins={[stripLinePlugin]} />
    </div>
  );
}

export default ThrusterChart;
