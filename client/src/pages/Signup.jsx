import { React, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Box, TextField, Button, createTheme, ThemeProvider, Typography, Link } from '@mui/material';

const MIN_LENGTH = 6;

export default function Signup() {

    const navigate = useNavigate();
    const { currentUser, register, setError } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [passError, setPassError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    //const [error, setError] = useState('');

    const darkTheme = createTheme({ palette: { mode: "dark" } });


    useEffect(() => {
        if (currentUser) {
          navigate("/");
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        if (password.length <= MIN_LENGTH) {
            setPassError("Must be more then 6 characters.")
        }
    }, [password]);

    useEffect(() => {
        if (password.length > MIN_LENGTH && passError) {
            setPassError('');
        }
    }, [password, passError]);

    useEffect(() => {
        if (confirmPassword !== password) {
            setConfirmError("Passwords must match!")
        }
    }, [password, confirmPassword]);

    useEffect(() => {
        if (password === confirmPassword && confirmError) {
            setConfirmError('');
        }
    }, [password, confirmPassword, confirmError]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length === 0 || confirmPassword.length === 0 || email.length === 0) {
            console.log("fill out all fields")
            setError("Please fill out all fields");
            return navigate('/signup');
        }

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setError("");
            setLoading(true);
            const { user } = await register(email, password);
            console.log(user.uid);
            await setDoc(doc(db, "Users", user.uid), 
            {
                firstName: firstName,
                lastName: lastName,
                email: email,
                restingBpm: 70,
            });
        } catch (error) {
            console.error(error);
            setError('Failed to register user');
        }
        
        setLoading(false);
    };

    return (
        <Box sx={{minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
            <ThemeProvider theme={darkTheme}>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        margin: "auto",
                        width: "50%",
                        color: 'white'
                    }}
                    onSubmit={handleSubmit}
                >
                    <Typography variant='h2' fontWeight="bold" sx={{margin:"auto", mb:"10px"}}>Sleep Tracker</Typography>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        <TextField id="firstName" sx={{mb: '20px', width:'48%'}} label="First Name" variant="outlined"  value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                        <TextField id="lastName" sx={{mb: '20px', width:'48%'}} label="Last Name" variant="outlined" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                    <TextField id='email' sx={{mb: '20px'}} type='email' label='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <TextField id='password' sx={{mb: '20px'}} type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <TextField id='confirmPassword' sx={{mb: '20px'}} type='password' label='Password Confirmation' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={confirmPassword !== password} helperText={confirmError}/>
                    <Box sx={{display:'flex', flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                        <Link href="/login">Have an account already? Login here</Link>
                        <Button id='signup' variant='contained' type='submit' disabled={loading}>Signup</Button>
                    </Box>
                </Box>
            </ThemeProvider>
        </Box>
    );
};
