import React, { useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, TextField, FormControl, DialogActions, Button, createTheme, ThemeProvider, FormHelperText } from '@mui/material'
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { createAlarm } from '../interfaces/alarmInterface';
import { useAuth } from "../contexts/AuthContext";

export default function AlarmDialog(props) {
    const { currentUser } = useAuth();
    const [alarmName, setAlarmName] = useState("")
    const [startTime, setStartTime] = useState(dayjs('2023-04-20T6:30'))
    const [endTime, setEndTime] = useState(dayjs('2023-04-20T8:30'))
    const [titleError, setTitleError] = useState(false)
    const [timeError, setTimeError] = useState(false)

    const darkTheme = createTheme({ palette: { mode: "dark" } });

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setTitleError(false)
        setTimeError(false)
        if(alarmName === ""){
            setTitleError(true)
            return
        }
        if(startTime.diff(endTime) >= 0){
            setTimeError(true)
            return
        }
        await createAlarm(currentUser.uid, alarmName, startTime, endTime,)
        handleClose()
        window.location.reload();
    }

    const handleClose = () => {
        props.setDialog(false);
    };

    return (props.dialog) ?
    (
        <Box>
            <ThemeProvider theme={darkTheme}>
                <Dialog open={props.dialog} onClose={handleClose} >
                    <DialogTitle>
                        Add Alarm
                    </DialogTitle>
                    <DialogContent sx={{display:"flex", flexDirection:"column"}}>
                        <FormControl sx={{mt:"10px"}}>
                            <TextField label="Alarm Name" onChange={e => setAlarmName(e.target.value)} />
                            {
                                titleError ?
                                <FormHelperText>Alarm Name Is Required</FormHelperText>
                                :
                                null
                            }
                        </FormControl>
                        <FormControl sx={{mt:"10px"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                    label="Start Time"
                                    value={startTime}
                                    onChange={(newValue) => setStartTime(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </FormControl>
                        <FormControl sx={{mt:"10px"}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimePicker']}>
                                    <TimePicker
                                    label="End Time"
                                    value={endTime}
                                    onChange={(newValue) => setEndTime(newValue)}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                            {
                                timeError ?
                                <FormHelperText>Start Time Must Come Before End Time</FormHelperText>
                                :
                                null
                            }
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFormSubmit} variant="contained" sx={{textTransform:"none"}}>Save</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </Box>
    )
    :
    null
}
