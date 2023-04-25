import React, { useEffect, useState } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
      <div>
        <form onSubmit={handleSubmit}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={ loading }>Login</button>
        </form>
      </div>
    );
  };
  
  export default Login;
  