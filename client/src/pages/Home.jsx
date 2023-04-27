import {React, useState, useEffect} from 'react'
import { deleteAlarm, getUserAlarms, setAlarmToggle, deactivateAlarms } from '../interfaces/alarmInterface';
import { Box, Button, Typography, TableRow, TableCell, Stack, TableContainer, Table, TableBody, Switch, Divider, tableCellClasses, CircularProgress, IconButton, createTheme, ThemeProvider } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import AlarmDialog from '../dialogs/alarmDialog';
import { getUserData } from '../interfaces/userInterface';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Graph from '../components/HrmGraph';
import HrDialog from '../dialogs/hrDialog';
import BeepDialog from '../dialogs/beepDialog';

const darkTheme = createTheme({ palette: { mode: "dark" } });

export default function Home() {

    const { currentUser, logout, setError } = useAuth();
    const navigate = useNavigate();
    const [alarms, setAlarms] = useState([]);
    const [firstName, setFirstName] = useState("")
    const [loading, setLoading] = useState(true)
    const [alarmDialog, setAlarmDialog] = useState(false)
    const [hrDialog, setHrDialog] = useState(false)
    const [beepDialog, setBeepDialog] = useState(false)
    const [heartRate, setHeartRate] = useState(85)
    const [currentTime, setCurrentTime] = useState(new Date());
    const [switches, setSwitches] = useState([])

    useEffect(() => {
      getUserAlarms(currentUser.uid).then(alarms => {
        console.log(alarms)
        setAlarms(alarms)
        setLoading(false)
        let data = []
        for(let key in alarms){
          data.push(alarms[key].isActive)
        }
        setSwitches(data)
      })
      getUserData(currentUser.uid).then(data => {
        setFirstName(data.firstName)
        setHeartRate(data.restingBpm)
      })

      // Set up a WebSocket connection to the server
      const socket = new WebSocket('ws://localhost:3001');

      // Listen for incoming messages from the server
      socket.addEventListener('message', event => {
        let values = JSON.parse(event.data)
        if(values.event === "beep"){
          console.log("beep")
          setBeepDialog(true)
        }
      });

      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }, [currentUser]);


    async function handleSignOut() {
      try {
        setError("");
        await logout();
        navigate("/login");
      } catch {
        setError("Failed to logout");
      }
    }

    const renderAlarms = () => {
      if (Object.keys(alarms).length === 0){
        return(
          <TableRow>
            <TableCell>
              <Divider color="white" sx={{mb:"20px"}}/>
              <Box sx={{display:"flex", justifyContent:"center", color:"white"}}>
                <Typography>You have no alarms yet</Typography>
              </Box>
            </TableCell>
          </TableRow>
        )
      }
      else {
        return(Object.keys(alarms).map(key => (
          <TableRow key={key} sx={{}}>
            <TableCell component="th" scope="row" sx={{padding:"16px 16px 0 16px"}}>
              <Divider color="white" sx={{mb:"20px"}}/>
              <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                <Box sx={{color:"white", mr:"40px"}}>
                  <Typography variant="h4">{formatTimeToAmPm(alarms[key].startTime.seconds)} to {formatTimeToAmPm(alarms[key].endTime.seconds)}</Typography>
                  <Typography>{alarms[key].alarmName}</Typography>
                </Box>
                <Box>
                  <Switch defaultChecked={alarms[key].isActive} onChange={(event) => toggleAlarm(key, event.target.checked, alarms[key])}/>
                  <IconButton onClick={() => handleDeleteAlarm(key)}>
                    <ClearIcon color="primary"/>
                  </IconButton>
                </Box>
              </Box>
            </TableCell>
          </TableRow>
        )))
      }
    }

    function formatTimeToAmPm(timestamp) {
      const date = new Date(timestamp * 1000)
      // Extract the hours and minutes from the Date object
      const hours = date.getHours();
      const minutes = date.getMinutes();
      // Convert hours to 12-hour format and determine am/pm
      const amPm = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 || 12; // Handles 12:00 pm as 12:00 instead of 00:00
      // Pad the minutes with leading zeros if necessary
      const formattedMinutes = String(minutes).padStart(2, '0');
      // Return the formatted time string
      return `${formattedHours}:${formattedMinutes}${amPm}`;
    }

    async function handleDeleteAlarm(alarmId) {
      await deleteAlarm(alarmId)
    }

    async function toggleAlarm(alarmId, status, data){
      await deactivateAlarms()
      //check if toggling on or off
      console.log(data)
      await setAlarmToggle(alarmId, status)
      if(status){
        fetch(`/api/alarm/on`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            startTime: data.startTime,
            endTime: data.endTime,
            alarmName: data.alarmName,
            restingHr: heartRate
          })
        })
      }
      else {
        fetch(`/api/alarm/off`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            startTime: data.startTime,
            endTime: data.endTime,
            alarmName: data.alarmName
          })
        })
      }
      window.location.reload()
    }
  //   <Box sx={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center"}}>
  //   <FormLabel>Resting Heart Rate:</FormLabel>
  //   <TextField id="outlined-basic" variant='standard' sx={{mx:"20px"}}/>
  //   <Button variant="contained" onClick={() => setDialog(true)} sx={{padding:"0", textTransform:"none"}}>Set</Button>
  // </Box>
  return (
    <Box sx={{backgroundColor:"#282c34", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pb:"100px"}}>
      <ThemeProvider theme={darkTheme}>
      {
        loading?
        <CircularProgress/>
        :
        <Box sx={{color:"white", display:"flex", flexDirection:"column", alignItems:"center"}}>
          <Box sx={{display:"flex", flexDirection:"column", alignItems:"center", mb:"20px"}}>
            <Typography variant='h2'>Hello, {firstName}</Typography>
            <Typography variant="h5">Current Time: {currentTime.toLocaleTimeString()}</Typography>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", mt:"-30px"}}>
              <Button onClick={() => setHrDialog(true)} sx={{mt:"30px", textDecoration:"underline", textTransform:"none"}}>{heartRate} BPM</Button>
              <Button onClick={handleSignOut} sx={{mt:"30px", textDecoration:"underline", textTransform:"none"}}>Sign out</Button>
            </Box>
          </Box>
          <Box sx={{display:"flex", flexDirection:"row"}}>
            <Box sx={{display:"flex", flexDirection:"column"}}>
              <Stack>
                  <TableContainer>
                      <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none"}}}>
                          <TableBody>
                              <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 }, overflow: "visible !important" }}>
                                <TableCell component="th" scope="row" sx={{mb:"-20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"white", overflow: "visible !important", minWidth:"400px"}}>
                                  <Box sx={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                    <Typography variant="h3">Alarms</Typography>
                                    <Button variant="contained" onClick={() => setAlarmDialog(true)} sx={{padding:"2px 5px", textTransform:"none"}}>Add Alarm</Button>
                                  </Box>
                                </TableCell>
                              </TableRow>
                              {renderAlarms(alarms)}
                          </TableBody>
                      </Table>
                  </TableContainer>
              </Stack>
            </Box>
            <Box sx={{ml:"20px", minWidth:"600px"}}>
                <Graph style={{height:"100%"}}/>
            </Box>
          </Box>
        </Box>
      }
      </ThemeProvider>
      <HrDialog dialog={hrDialog} setDialog={setHrDialog}/>
      <AlarmDialog dialog={alarmDialog} setDialog={setAlarmDialog}/>
      <BeepDialog dialog={beepDialog} setDialog={setBeepDialog}/>
    </Box>
  )
}
