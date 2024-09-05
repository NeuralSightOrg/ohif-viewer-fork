import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add your login logic here (API call)
    // If successful:
    localStorage.setItem('authToken', 'your-token'); // Store the token
    // history.push('/'); // Redirect to the main page
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginPage;
