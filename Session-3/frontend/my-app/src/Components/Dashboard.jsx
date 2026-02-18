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
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddButton from './AddTask';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { items, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTask());
    }
  }, [status, dispatch]);

  const tasksList = items?.tasksWithOwner || [];

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
          Task Manager
        </Typography>
        
        {/* <AddButton /> */}
        <Button onClick={() => navigate("/task/create")} type='outline'>Create Task</Button>

        <Divider sx={{ mb: 3 }} />

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