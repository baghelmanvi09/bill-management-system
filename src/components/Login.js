import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [error, setError] = useState('');

  // const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }
    if (username === 'admin' && password === 'password') {  // Example check for login
      onLogin(); // This will trigger the login state
      // navigate('/dashboard'); // Navigate to dashboard after login
      setError(''); // Clear any previous error messages
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={styles.loginContainer}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Login</h2>
        {error && <div style={styles.error}>{error}</div>} {/* Display error messages */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <div style={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
        </div>
        <button onClick={handleLogin} style={styles.loginButton}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    height: '100vh', // Full height of the viewport
    background: 'linear-gradient(135deg, #6e7f80, #8e9b97)', // Gradient background for elegance
    position: 'absolute', // Use absolute positioning to overlay on top of everything
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10, // Ensure the login form is on top of other elements
    margin: 0, // Ensure no margin around the container
  },
  formContainer: {
    backgroundColor: 'white', // White background for the form
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)', // More prominent shadow
    width: '320px', // Slightly larger width for more breathing space
    textAlign: 'center', // Center text inside the form
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '28px',
    fontWeight: '600',
  },
  input: {
    margin: '10px 0',
    padding: '10px',
    width: '100%',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    transition: 'all 0.3s ease', // Smooth transition for border color
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    cursor: 'pointer',
    color: '#007bff',
    fontSize: '14px',
  },
  loginButton: {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
    marginTop: '15px',
    transition: 'background-color 0.3s ease', // Smooth hover transition
  },
  loginButtonHover: {
    backgroundColor: '#45a049',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
    fontSize: '14px',
  },
};

export default Login;
