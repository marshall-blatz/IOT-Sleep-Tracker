import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Login = () => {
    const navigate = useNavigate();
    //const [data, setData] = useState(null);
    const { currentUser, login, setError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
      <>
        <Box 
          component='form'
          sx={{
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            width: "50%"
          }}
          onSubmit={handleSubmit}
        >
          <h1 className="heading" style={{fontSize: 75, fontWeight: 'bold', margin:'auto'}}>Sleep Tracker</h1>
          <TextField id='email' sx={{mb: '20px'}} type='email' label='Email Address' value={email} onChange={(e) => setEmail(e.target.value)}/>
          <TextField id='password' sx={{mb: '20px'}} type='password' label='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Button id='login' variant='contained' type='submit' disabled={loading} style={{margin: '10px'}}>Login</Button>


        </Box>
      </>
      // <div>
      //   <form onSubmit={handleSubmit}>
      //   <input
      //       type="email"
      //       placeholder="Email"
      //       value={email}
      //       onChange={(e) => setEmail(e.target.value)}
      //   />
      //   <input
      //       type="password"
      //       placeholder="Password"
      //       value={password}
      //       onChange={(e) => setPassword(e.target.value)}
      //   />
      //   <button type="submit" disabled={ loading }>Login</button>
      //   </form>
      // </div>
    );
  };
  
  export default Login;
  