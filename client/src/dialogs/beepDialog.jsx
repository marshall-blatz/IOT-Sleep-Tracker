import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, createTheme, ThemeProvider } from '@mui/material'
import { deactivateAlarms } from '../interfaces/alarmInterface';
import YouTube from 'react-youtube';
import React, {useState} from 'react'


export default function BeeDialog(props) {
    const [videoId, setVideoId] = useState('l4ANP8g8wrE');
    const darkTheme = createTheme({ palette: { mode: "dark" } });

    const handleClose = async () => {
        await deactivateAlarms()
        fetch(`/api/alarm/off`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              startTime: null,
              endTime: null,
              alarmName: null,
              restingHr: null
            })
          })
        props.setDialog(false);
        window.location.reload()
    };

    return (props.dialog) ?
    (
        <Box>
            <ThemeProvider theme={darkTheme}>
                <Dialog open={props.dialog} onClose={handleClose} >
                    <DialogTitle>
                        Wake Up King!
                    </DialogTitle>
                    <DialogContent sx={{display:"flex", flexDirection:"column"}}>
                    <YouTube
                    videoId={videoId}
                    onReady={(event) => event.target.playVideo()}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} variant="contained" sx={{textTransform:"none"}}>Turn off</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </Box>
    )
    :
    null
}
