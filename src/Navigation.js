import React, { useState } from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

// Blog topics as defined in requirements
const topics = [
  'All',
  'Academic Resources',
  'Career Services',
  'Campus',
  'Culture',
  'Local Community Resources',
  'Social',
  'Sports',
  'Health and Wellness',
  'Technology',
  'Travel',
  'Alumni'
];

const Navigation = ({ currentUser, onLogout, onTopicChange, currentTopic }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Role badge colors
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'Administrator': return 'error';
      case 'Moderator': return 'warning';
      case 'Faculty': return 'success';
      case 'Staff': return 'info';
      default: return 'default';
    }
  };
  
  // Handle topic selection
  const handleTopicClick = (topic) => {
    onTopicChange(topic);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };
  
  // Toggle drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // User menu functions
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };
  
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };
  
  // Topic drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
    >
      <List>
        <ListItem>
          <Typography variant="h6">Topics</Typography>
        </ListItem>
        <Divider />
        {topics.map((topic) => (
          <ListItem key={topic} disablePadding>
            <ListItemButton 
              selected={currentTopic === topic}
              onClick={() => handleTopicClick(topic)}
            >
              <ListItemText primary={topic} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Campus Blog
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', mx: 2 }}>
              {topics.slice(0, 5).map((topic) => (
                <Button 
                  key={topic}
                  color="inherit"
                  onClick={() => handleTopicClick(topic)}
                  sx={{ 
                    mx: 0.5,
                    fontWeight: currentTopic === topic ? 'bold' : 'normal',
                    textDecoration: currentTopic === topic ? 'underline' : 'none'
                  }}
                >
                  {topic}
                </Button>
              ))}
              <Button 
                color="inherit"
                onClick={handleUserMenuOpen}
              >
                More...
              </Button>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
              >
                {topics.slice(5).map((topic) => (
                  <MenuItem 
                    key={topic}
                    onClick={() => {
                      handleTopicClick(topic);
                      handleUserMenuClose();
                    }}
                    selected={currentTopic === topic}
                  >
                    {topic}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              icon={<AccountCircleIcon />}
              label={`${currentUser.username} (${currentUser.role})`}
              color={getRoleBadgeColor(currentUser.role)}
              variant="outlined"
              sx={{ 
                color: 'white',
                borderColor: 'white',
                mr: 1,
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <IconButton 
              color="inherit" 
              onClick={onLogout}
              title="Logout"
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer for topics */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navigation;