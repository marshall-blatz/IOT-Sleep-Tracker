import React, { useState } from 'react'
import { Box, Dialog, DialogTitle, DialogContent, TextField, FormControl, DialogActions, Button, createTheme, ThemeProvider, FormHelperText } from '@mui/material'
import { useAuth } from "../contexts/AuthContext";
import { setHR } from '../interfaces/userInterface';

export default function HrDialog(props) {
    const { currentUser } = useAuth();
    const [heartRate, setHeartRate] = useState(0)
    const [numError, setNumError] = useState(false)

    const darkTheme = createTheme({ palette: { mode: "dark" } });

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        setNumError(false)
        if(JSON.parse(heartRate) <= 0){
            setNumError(true)
            return
        }
        await setHR(currentUser.uid, JSON.parse(heartRate))
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
                        Set Resting Heart Rate
                    </DialogTitle>
                    <DialogContent sx={{display:"flex", flexDirection:"column"}}>
                        <FormControl sx={{mt:"10px"}}>
                            <TextField type="number" label="Heart Rate (BPM)" onChange={e => setHeartRate(e.target.value)} />
                            {
                                numError ?
                                <FormHelperText>Heart Rate must be above 0</FormHelperText>
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
