import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert
} from '@mui/material';

    const Login = ({ onLogin, users }) => {
        const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        const [role, setRole] = useState('Student');
        const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find user in our hardcoded list
    const user = users.find(
      u => u.username === username && u.password === password && u.role === role
    );
    
    if (!user) {
      setError('Invalid username, password, or role');
      return;
    }
    
    if (user.disabled) {
      setError('This account has been disabled. Please contact an administrator.');
      return;
    }
    
    // Login successful
    onLogin(user);
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Campus Blogging Platform
        </Typography>
        <Typography component="h2" variant="h6" align="center" sx={{ mb: 3 }}>
          Sign In
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Faculty">Faculty</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
              <MenuItem value="Moderator">Moderator</MenuItem>
              <MenuItem value="Administrator">Administrator</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          
          <Typography variant="body2" color="text.secondary" align="center">
            Try these accounts:
            student1/student123, faculty1/faculty123, staff1/staff123, 
            moderator/mod123, admin/admin123
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;