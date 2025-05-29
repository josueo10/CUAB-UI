import React from 'react';
import Plot from 'react-plotly.js';


// Consts for graph, change as needed
const x_min = -0.5;
const x_max = .17;
const y_min = -.15;
const y_max = .15;

const BoatPositionChart = ({xpositionData, ypositionData }) => {
  const data = [
    {
      x: xpositionData,
      y: ypositionData,
      mode: 'lines+markers',
      type: 'scatter',
      line: {
        shape: 'spline',
        smoothing: 100,
      }
    },
  ];
  const layout = {
    xaxis: { range: [x_min, x_max], title: 'X Position' },
    yaxis: { range: [y_min, y_max], title: 'Y Position' },
    title: 'Boat Position Over Time',
    responsive: true,
  };
  return (
    <div style={{
      width: '700px',
      height: '450px',
      margin: '50px auto',
      border: '2px solid black',
    }}>
      <Plot
        data={data}
        layout={layout}
      />
    </div>
  );
};
export default BoatPositionChart;