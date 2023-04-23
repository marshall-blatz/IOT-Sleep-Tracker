import { React, useState } from 'react'

export default function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        // Call the /api/signup route with email and password
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Check for success status
        if (response.ok) {
            // Handle successful login
            const { user } = await response.json();
            console.log('Logged in user:', user);
            // Redirect or perform other actions as needed
        } else {
            // Handle unsuccessful login
            setError('Failed to authenticate user');
        }
        } catch (error) {
        console.error(error);
        setError('Failed to authenticate user');
        }
    };

    return (
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
        <button type="submit">Login</button>
        {error && <p>{error}</p>}
        </form>
    );
};
