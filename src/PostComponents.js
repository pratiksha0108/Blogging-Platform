import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardActions, 
  Divider, 
  Avatar, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Collapse,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AddCircleIcon from '@mui/icons-material/AddCircle';

// Topic list
const topics = [
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

// Create Post Dialog Component
const CreatePostDialog = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('Academic Resources');

  const handleSubmit = () => {
    if (title.trim() && content.trim()) {
      onSubmit({ title, content, topic });
      setTitle('');
      setContent('');
      setTopic('Academic Resources');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create New Post</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="topic-select-label">Topic</InputLabel>
          <Select
            labelId="topic-select-label"
            id="topic-select"
            value={topic}
            label="Topic"
            onChange={(e) => setTopic(e.target.value)}
          >
            {topics.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          autoFocus
          margin="normal"
          id="post-title"
          label="Post Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="normal"
          id="post-content"
          label="Content"
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!title.trim() || !content.trim()}
        >
          Post
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Reply Dialog Component
const ReplyDialog = ({ open, onClose, onSubmit, postId }) => {
  const [reply, setReply] = useState('');

  const handleSubmit = () => {
    if (reply.trim()) {
      onSubmit(postId, reply);
      setReply('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Reply to Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          id="reply-content"
          label="Your Reply"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!reply.trim()}
        >
          Submit Reply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Post Item Component
const PostItem = ({ post, currentUser, onAddReply, onDeletePost }) => {
  const [expanded, setExpanded] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  
  // Get first letter for avatar
  const getAvatarLetter = (name) => {
    return name.charAt(0).toUpperCase();
  };
  
  // Get role from username (simulated)
  const getUserRole = (username) => {
    if (username === 'admin') return 'Administrator';
    if (username === 'moderator') return 'Moderator';
    if (username.includes('faculty')) return 'Faculty';
    if (username.includes('staff')) return 'Staff';
    return 'Student';
  };

  // Toggle reply dialog
  const handleReplyClick = () => {
    setReplyDialogOpen(true);
  };

  const handleReplyDialogClose = () => {
    setReplyDialogOpen(false);
  };

  // Submit reply
  const handleReplySubmit = (postId, reply) => {
    onAddReply(postId, reply);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: post.author === 'admin' ? 'error.main' : 'primary.main' }}>
            {getAvatarLetter(post.author)}
          </Avatar>
        }
        title={post.title}
        subheader={
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{post.author} ({getUserRole(post.author)})</span>
            <span>{post.date}</span>
          </Box>
        }
        action={
          (currentUser.role === 'Moderator' || currentUser.role === 'Administrator') && (
            <Tooltip title="Delete Post">
              <IconButton onClick={() => onDeletePost(post.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Tooltip>
          )
        }
      />
      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Topic: {post.topic}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button 
          startIcon={<ReplyIcon />}
          onClick={handleReplyClick}
          size="small"
        >
          Reply
        </Button>
        
        {post.replies && post.replies.length > 0 && (
          <Button
            onClick={() => setExpanded(!expanded)}
            startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            size="small"
            sx={{ ml: 'auto' }}
          >
            {expanded ? 'Hide' : 'Show'} {post.replies.length} {post.replies.length === 1 ? 'Reply' : 'Replies'}
          </Button>
        )}
      </CardActions>
      
      {/* Replies Section */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <List sx={{ bgcolor: 'background.paper', py: 0 }}>
          {post.replies.map((reply) => (
            <ListItem key={reply.id} alignItems="flex-start" sx={{ px: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  {getAvatarLetter(reply.author)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography component="span" variant="subtitle2">
                      {reply.author}
                    </Typography>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {reply.date}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {reply.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Collapse>
      
      {/* Reply Dialog */}
      <ReplyDialog
        open={replyDialogOpen}
        onClose={handleReplyDialogClose}
        onSubmit={handleReplySubmit}
        postId={post.id}
      />
    </Card>
  );
};

// Main PostComponents
const PostComponents = ({ posts, currentUser, onAddPost, onAddReply, onDeletePost }) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const handleCreateDialogOpen = () => {
    setCreateDialogOpen(true);
  };
  
  const handleCreateDialogClose = () => {
    setCreateDialogOpen(false);
  };
  
  const handleCreatePost = (postData) => {
    onAddPost({
      ...postData,
      author: currentUser.username
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          onClick={handleCreateDialogOpen}
        >
          Create Post
        </Button>
      </Box>
      
      {posts.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No posts available in this topic. Be the first to create a post!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleCreateDialogOpen}
            sx={{ mt: 2 }}
          >
            Create Post
          </Button>
        </Paper>
      ) : (
        posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            currentUser={currentUser}
            onAddReply={onAddReply}
            onDeletePost={onDeletePost}
          />
        ))
      )}
      
      {/* Create Post Dialog */}
      <CreatePostDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        onSubmit={handleCreatePost}
      />
    </Box>
  );
};

export default PostComponents;