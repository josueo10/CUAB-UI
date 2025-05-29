import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const style = {
  Container: {
    display: 'flex',
    flexDirection: 'row', // Makes the charts display vertically
    gap: '20px', // Adds space between the charts
    alignItems: 'center' // Center aligns the charts
  }
}
const OnOffChart = ({ sectionLabel, sectionColor }) => {
  const data = {
    labels: [sectionLabel], // Use label passed via props
    datasets: [
      {
        data: [100], // Entire chart
        backgroundColor: [sectionColor], // Use color passed via props
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    animation: false,
    cutout: '50%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: '200px', height: '200px', border: '2px solid black',}}> {/* Control size, border with container */}
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default OnOffChart;