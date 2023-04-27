import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

const Graph = () => {
  const chartRef = useRef();
  const [data, setData] = useState([]); // State to store the data points

  useEffect(() => {
    // Create a new chart using the chartRef canvas element
    const chart = new Chart(chartRef.current, {
        type: 'line', // You can change the type of graph here (e.g., 'bar', 'pie', etc.)
        data: {
            labels: [], // Array to store labels (x-axis)
            datasets: [
            {
                label: 'Current Heart Rate', // Label for the data series
                data: [], // Array to store data points (y-axis)
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color for the data series
                borderColor: 'rgb(66, 165, 245, 1)', // Border color for the data series
                borderWidth: 1 // Border width for the data series
            }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        },
    });

    // Function to add a new data point to the graph
    const addDataPoint = (label, data) => {
      chart.data.labels.push(label);
      chart.data.datasets[0].data.push(data);
      chart.update();
    };

    // Set up a WebSocket connection to the server
    const socket = new WebSocket('ws://localhost:3001');

    // Listen for incoming messages from the server
    socket.addEventListener('message', event => {
      let values = JSON.parse(event.data)
      if(values.event === "graph"){
        const data = JSON.parse(values.data);
        const label = new Date().toLocaleTimeString();
        setData(data); // Update the state with the new data points
        addDataPoint(label, data); // Add the new data point to the graph
      }
    });

    // Return a function to clean up the interval when the component unmounts
    return () => {
        socket.close()
        chart.destroy();
    };
  }, []);

  return (
    <div style={{height:"100%", width:"100%"}}>
      <canvas ref={chartRef}/>
    </div>
  );
};

export default Graph;
