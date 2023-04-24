import {React, useState, useEffect} from 'react'
import { getUserAlarms } from '../interfaces/alarmInterface';
import { Box, Button, Typography, TableRow, TableCell, Stack, TableContainer, Table, TableBody, Switch, Divider, tableCellClasses, CircularProgress } from '@mui/material'
import AlarmDialog from '../dialogs/alarmDialog';
import { getFirstName } from '../interfaces/userInterface';

export default function Home() {
    const [alarms, setAlarms] = useState([]);
    const [firstName, setFirstName] = useState("")
    const [loading, setLoading] = useState(true)
    const [dialog, setDialog] = useState(false)

    useEffect(() => {
      getUserAlarms("cfHTvZ3S41FWKmVZT8ZX").then(data => {
        setAlarms(data)
        setLoading(false)
      })
      getFirstName("cfHTvZ3S41FWKmVZT8ZX").then(data => {
        setFirstName(data)
      })
    }, []);


    const renderAlarms = () => {
      return(Object.keys(alarms).map(key => (
        <TableRow key={key} sx={{}}>
          <TableCell component="th" scope="row" sx={{padding:"16px 16px 0 16px"}}>
            <Divider color="white" sx={{mb:"20px"}}/>
            <Box sx={{display:"flex", flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
              <Box sx={{color:"white", mr:"40px"}}>
                <Typography variant="h4">{formatTimeToAmPm(alarms[key].startTime.seconds)} to {formatTimeToAmPm(alarms[key].endTime.seconds)}</Typography>
                <Typography>{alarms[key].alarmName}</Typography>
              </Box>
              <Switch />
            </Box>
          </TableCell>
        </TableRow>
      )))
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

  return (
    <Box sx={{backgroundColor:"#282c34", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
      {
        loading?
        <CircularProgress/>
        :
        <Stack>
            <TableContainer>
                <Table sx={{[`& .${tableCellClasses.root}`]: {borderBottom: "none"}}}>
                    <TableBody>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 }, overflow: "visible !important" }}>
                          <TableCell component="th" scope="row" sx={{mb:"-20px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", color:"white", overflow: "visible !important" }}>
                            <Box sx={{width:"100%", display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                              <Typography>Hello, {firstName}</Typography>
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
      }
      <AlarmDialog dialog={dialog} setDialog={setDialog}/>
    </Box>
  )
}
