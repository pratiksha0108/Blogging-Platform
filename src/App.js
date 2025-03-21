import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';
import Login from './Login';
import Navigation from './Navigation';
import PostComponents from './PostComponents';
import UserManagement from './UserManagement';

const initialUsers = [
  { username: 'student1', password: 'student123', role: 'Student', disabled: false },
  { username: 'faculty1', password: 'faculty123', role: 'Faculty', disabled: false },
  { username: 'staff1', password: 'staff123', role: 'Staff', disabled: false },
  { username: 'moderator', password: 'mod123', role: 'Moderator', disabled: false },
  { username: 'admin', password: 'admin123', role: 'Administrator', disabled: false },
  { username: 'disabled_user', password: 'test123', role: 'Student', disabled: true }
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  const [posts, setPosts] = useState([
    { 
      id: 1, 
      topic: 'Academic Resources', 
      title: 'Library Extended Hours', 
      content: 'The library will have extended hours during finals week.', 
      author: 'admin', 
      date: '2025-03-09',
      replies: []
    },
    { 
      id: 2, 
      topic: 'Sports', 
      title: 'Basketball Tournament', 
      content: 'Join us for the annual basketball tournament next weekend!', 
      author: 'faculty1', 
      date: '2025-03-08',
      replies: []
    }
  ]);
  
  // Current topic filter
  const [currentTopic, setCurrentTopic] = useState('All');
  
  // Manage login state
  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  // Manage logout
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  // Add a new post
  const addPost = (newPost) => {
    setPosts([...posts, { 
      ...newPost, 
      id: posts.length + 1, 
      date: new Date().toISOString().split('T')[0],
      replies: []
    }]);
  };

  // Add a reply to a post
  const addReply = (postId, reply) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, { 
            id: post.replies.length + 1, 
            content: reply, 
            author: loggedInUser.username, 
            date: new Date().toISOString().split('T')[0] 
          }]
        };
      }
      return post;
    }));
  };

  // Delete a post (for moderator)
  const deletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  // Handle account status change (for admin)
  // Toggle account status function
  const toggleAccountStatus = (username) => {
    setUsers(users.map(user => {
      if (user.username === username) {
        return { ...user, disabled: !user.disabled };
      }
      return user;
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        {!loggedInUser ? (
          <Login onLogin={handleLogin} users={users} />
        ) : (
          <>
            <Navigation 
              currentUser={loggedInUser} 
              onLogout={handleLogout}
              onTopicChange={setCurrentTopic}
              currentTopic={currentTopic}
            />
            
            {loggedInUser.role === 'Administrator' && (
              <UserManagement 
                users={users}
                toggleAccountStatus={toggleAccountStatus} 
              />
            )}
            
            <PostComponents 
              posts={posts.filter(post => currentTopic === 'All' || post.topic === currentTopic)}
              currentUser={loggedInUser}
              onAddPost={addPost}
              onAddReply={addReply}
              onDeletePost={deletePost}
            />
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;