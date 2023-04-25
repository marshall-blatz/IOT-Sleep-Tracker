import { React, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

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
        // Call the /api/signup route with email and password
        // const response = await fetch('/api/signup', {
        //     method: 'POST',
        //     headers: {
        //     'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ email, password }),
        // });

        // Check for success status
        // if (response.ok) {
        //     // Handle successful login
        //     const { user } = await response.json();
        //     console.log('Logged in user:', user);
        //     // Redirect or perform other actions as needed
        // } else {
        //     // Handle unsuccessful login
        //     setError('Failed to authenticate user');
        // }
        } catch (error) {
            console.error(error);
            setError('Failed to register user');
        }
        
        setLoading(false);
    };

    return (
        <>
            <Box
                component="form"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "auto",
                    width: "50%"
                }}
                onSubmit={handleSubmit}
            >
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
                <TextField id='email' sx={{mb: '20px'}} label='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                
            </Box>
        </>
        // <form onSubmit={handleSubmit}>
        // <input
        //     type="email"
        //     placeholder="Email"
        //     value={email}
        //     onChange={(e) => setEmail(e.target.value)}
        // />
        // <input 
        //     type="text"
        //     placeholder='First Name'
        //     value={firstName}
        //     onChange={(e) => setFirstName(e.target.value)}
        // />
        // <input
        //     type='text'
        //     placeholder='Last Name'
        //     value={lastName}
        //     onChange={(e) => setLastName(e.target.value)}
        // />
        // <input
        //     type="password"
        //     placeholder="Password"
        //     value={password}
        //     onChange={(e) => setPassword(e.target.value)}
        // />
        // <input
        //     type='password'
        //     placeholder='Confirm Password'
        //     value={confirmPassword}
        //     onChange={(e) => setConfirmPassword(e.target.value)}
        // />
        // <button type="submit" disabled={ loading }>Signup</button>
        // {/* {error && <p>{error}</p>} */}
        // </form>
    );
};
