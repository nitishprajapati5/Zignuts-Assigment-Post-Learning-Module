import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTask } from '../Store/TaskSlice/taskSlice';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

function Dashboard() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.tasks);
  const [taskInput, setTaskInput] = useState("");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTask());
    }
  }, [status, dispatch]);

  // Safely extract tasks array from the nested items object
  const tasksList = items?.tasksWithOwner || [];

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Task Manager
        </Typography>
        
        {/* Input Section */}
        <Box sx={{ display: 'flex', gap: 1, mb: 4, mt: 2 }}>
          <TextField
            fullWidth
            label="Add a new task"
            variant="outlined"
            size="small"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ px: 3 }}
          >
            Add
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Status Handling */}
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TaskAltIcon color="action" /> Your Tasks
        </Typography>

        {status === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={30} />
          </Box>
        )}

        {status === 'failed' && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {/* Task List Section */}
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {status === 'succeeded' && tasksList.length > 0 ? (
            tasksList.map((task) => (
              <Box key={task.id || task._id}>
                <ListItem 
                  sx={{ 
                    transition: '0.2s',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                    borderRadius: 1
                  }}
                >
                  <ListItemText 
                    primary={task.title} 
                    secondary={task.description || "No description"}
                  />
                </ListItem>
                <Divider component="li" />
              </Box>
            ))
          ) : (
            status === 'succeeded' && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                No tasks available. Start by adding one above!
              </Typography>
            )
          )}
        </List>
      </Paper>
    </Container>
  );
}

export default Dashboard;