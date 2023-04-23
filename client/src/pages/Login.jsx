import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [data, setData] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('/api/data/123'); // Replace with your own API endpoint
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div>
        {data ? (
          <div>
            <h1>Data:</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    );
  };
  
  export default Login;
  