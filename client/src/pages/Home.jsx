import {React, useState, useEffect} from 'react'
import { getUserAlarms } from '../interfaces/alarmInterface';

export default function Home() {
    const [alarms, setAlarms] = useState(null);

    useEffect(() => {
      getUserAlarms("cfHTvZ3S41FWKmVZT8ZX").then(data => {
        console.log(data)
        setAlarms(data)
      })
    }, []);


  return (
    <div className="App">
      <header className="App-header">
        
      </header>
    </div>
  )
}
