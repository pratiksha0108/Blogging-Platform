import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Switch,
  Chip,
  IconButton,
  Collapse
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const UserManagement = ({ users, toggleAccountStatus }) => {
  const [expanded, setExpanded] = useState(false);

  // Toggle disabled status
  const handleToggleDisabled = (username) => {
    toggleAccountStatus(username);
  };

  // Role status colors
  const getRoleColor = (role) => {
    switch(role) {
      case 'Administrator': return 'error';
      case 'Moderator': return 'warning';
      case 'Faculty': return 'success';
      case 'Staff': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ mt: 3, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Typography variant="h6" component="h2">
            User Management
          </Typography>
          <IconButton>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        
        <Collapse in={expanded}>
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role} 
                        size="small" 
                        color={getRoleColor(user.role)} 
                        variant={user.role === 'Administrator' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.disabled ? 'Disabled' : 'Active'} 
                        size="small"
                        color={user.disabled ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={!user.disabled}
                        onChange={() => handleToggleDisabled(user.username)}
                        disabled={user.role === 'Administrator' && user.username === 'admin'} // Prevent disabling the main admin
                        inputProps={{ 'aria-label': 'toggle user account status' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Paper>
    </Box>
  );
};

export default UserManagement;