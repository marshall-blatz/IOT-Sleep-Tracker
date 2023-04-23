import {React, useState, useEffect} from 'react'

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/api/data")
        .then((res) => res.json())
        .then((data) => setData(data.message));
    }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
      </header>
    </div>
  )
}
