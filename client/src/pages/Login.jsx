import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, createTheme, ThemeProvider, Typography, Link } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    //const [data, setData] = useState(null);
    const { currentUser, login, setError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const darkTheme = createTheme({ palette: { mode: "dark" } });


    // user logged in already,navigate home
    useEffect(() => {
      if (currentUser) {
        navigate("/");
      }
    }, [currentUser, navigate]);

    async function handleSubmit(e) {
      e.preventDefault();

      try {
        setError("");
        setLoading(true);
        await login(email, password);
      }
      catch(e) {
        console.log(e);
        setError('Failed to login');
      }
      setLoading(false);
    }
  
    return (
      <Box sx={{minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center"}}>
        <ThemeProvider theme={darkTheme}>
          <Box 
            component='form'
            sx={{ display: "flex", flexDirection: "column", margin: "auto", width: "50%", justifyContent: "center", color:"white"}}
            onSubmit={handleSubmit}
          >
            <Typography variant="h2" fontWeight="bold" sx={{margin:"auto", mb:"10px"}}>Login</Typography>
            <TextField id='email' sx={{mb: '20px'}} type='email' label='Email Address' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <TextField id='password' sx={{mb: '20px'}} type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            <Box sx={{display:'flex', flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
              <Link href="/signup">Don't have an account? Sign up here</Link>
              <Button id='login' variant='contained' type='submit' disabled={loading} style={{}}>Login</Button>
            </Box>
            </Box>
        </ThemeProvider>
      </Box>
    );
  };
  
  export default Login;
  