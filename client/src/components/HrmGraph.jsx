import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const Graph = () => {
  const chartRef = useRef();

  useEffect(() => {
    // Create a new chart using the chartRef canvas element
    const chart = new Chart(chartRef.current, {
        type: 'line', // You can change the type of graph here (e.g., 'bar', 'pie', etc.)
        data: {
            labels: [], // Array to store labels (x-axis)
            datasets: [
            {
                label: 'Data', // Label for the data series
                data: [], // Array to store data points (y-axis)
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color for the data series
                borderColor: 'rgba(75, 192, 192, 1)', // Border color for the data series
                borderWidth: 1 // Border width for the data series
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
            y: {
                beginAtZero: true // Start the y-axis from zero
            }
            }
        }
        });

    // Function to add a new data point to the graph
    const addDataPoint = (label, data) => {
      chart.data.labels.push(label);
      chart.data.datasets[0].data.push(data);
      chart.update();
    };

    // Call the addDataPoint function every 2 seconds
    const interval = setInterval(() => {
      const label = new Date().toLocaleTimeString(); // Use current time as label
      const data = Math.random() * 100;
      addDataPoint(label, data);
    }, 2000);

    // Return a function to clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default Graph;
