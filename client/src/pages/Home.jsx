import {React, useState, useEffect} from 'react'
import { deleteAlarm, getUserAlarms, setAlarmToggle } from '../interfaces/alarmInterface';
import { Box, Button, Typography, TableRow, TableCell, Stack, TableContainer, Table, TableBody, Switch, Divider, tableCellClasses, CircularProgress, IconButton } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import AlarmDialog from '../dialogs/alarmDialog';
import { getFirstName } from '../interfaces/userInterface';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {

    const { currentUser, logout, setError } = useAuth();
    const navigate = useNavigate();
    const [alarms, setAlarms] = useState([]);
    const [firstName, setFirstName] = useState("")
    const [loading, setLoading] = useState(true)
    const [dialog, setDialog] = useState(false)

    useEffect(() => {
      getUserAlarms("kqdSCMB0ilur5daBOlzF").then(alarms => {
        setAlarms(alarms)
        setLoading(false)
      })
      getFirstName(currentUser.uid).then(data => {
        setFirstName(data)
      })
    }, [currentUser]);

    async function handleLogout() {
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
                  <Switch defaultChecked={alarms[key].isActive} onChange={(event) => toggleAlarm(key, event.target.checked)}/>
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

    const handleSignOut = () => {
      console.log("Put sign out logic here")
    }

    async function toggleAlarm(alarmId, status){
      //check if toggling on or off
      await setAlarmToggle(alarmId, status)
      if(status){
        fetch(`/api/alarm/on/${alarmId}`)
      }
      else {
        fetch(`/api/alarm/off/${alarmId}`)
      }
    }

  return (
    <Box sx={{backgroundColor:"#282c34", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pb:"100px"}}>
      {
        loading?
        <CircularProgress/>
        :
        <>
        <Stack>
            <TableContainer>
                <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none"}}}>
                    <TableBody>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 }, overflow: "visible !important" }}>
                          <TableCell component="th" scope="row" sx={{mb:"-20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"white", overflow: "visible !important", minWidth:"400px"}}>
                            <Box sx={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                              <Typography>Hello, {firstName}</Typography>
                              <Button variant="contained" onClick={() => handleLogout()} sx={{padding:"2px 5px", textTransform:"none"}}>Logout</Button>
                              <Button variant="contained" onClick={() => setDialog(true)} sx={{padding:"2px 5px", textTransform:"none"}}>Add Alarm</Button>
                            </Box>
                            <Typography variant="h3">Alarms</Typography>
                          </TableCell>
                        </TableRow>
                        {renderAlarms()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
        <Button onClick={handleSignOut} sx={{textDecoration:"underline", textTransform:"none"}}>Sign out</Button>
        </>
      }
      <AlarmDialog dialog={dialog} setDialog={setDialog}/>
    </Box>
  )
}
