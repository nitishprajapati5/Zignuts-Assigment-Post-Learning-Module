import { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, fetchTask } from '../Store/TaskSlice/taskSlice';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  CardActions,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';
import { Snackbar } from '@mui/material';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const { items, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if(location.state?.message){
      setAlertMsg(location.state.message)
      setOpenSnackbar(true)
    }
    dispatch(fetchTask());
  }, [dispatch,location]);

  const tasksList = items?.tasksWithOwner || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      default: return 'default';
    }
  };

  const handleDelete = (data) => {
    dispatch(deleteTask(data))
  }

  const handleEditChanges = (data) => {
    navigate(`/edit/${data}`)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>

        <Snackbar 
        open={openSnackbar} 
        autoHideDuration={4000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>

        <Box>
          <Typography variant="h4" fontWeight="800" color="primary.main">
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track your team's progress
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate("/task/create")}
          sx={{ borderRadius: 2, px: 3, py: 1, boxShadow: 2 }}
        >
          New Task
        </Button>
      </Box>

      {/* Loading State */}
      {status === 'loading' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
          <CircularProgress thickness={4} size={50} />
          <Typography sx={{ mt: 2 }} color="text.secondary">Fetching your tasks...</Typography>
        </Box>
      )}

      {/* Error State */}
      {status === 'failed' && (
        <Alert severity="error" variant="filled" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Task Grid */}
      <Grid container spacing={3}>
        {status === 'succeeded' && tasksList.length > 0 ? (
          tasksList.map((task) => (
            <Grid item xs={12} sm={6} key={task.id || task._id}>
              <Card 
                elevation={0} 
                sx={{ 
                  borderRadius: 3, 
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: '0.3s',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.05)',
                    borderColor: 'primary.light'
                  } 
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip 
                      label={task.status || 'pending'} 
                      size="small" 
                      color={getStatusColor(task.status)}
                      sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">
                        {task.dueDate ? dayjs(task.dueDate).format('MMM D, YYYY') : 'No date'}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                    {task.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '40px'
                    }}
                  >
                    {task.description || "No description provided."}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                   <Typography variant="caption" color="primary" fontWeight="600">
                      Assigned to: {task.assignedUserDetails?.email || 'Unassigned'}
                   </Typography>
                   <Box>
                      <Tooltip title="Edit Task">
                        <IconButton onClick={() => handleEditChanges(task.id)} size="small" color="inherit">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Task">
                        <IconButton onClick={() => handleDelete(task.id)} size="small" color="error">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                   </Box>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          status === 'succeeded' && (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 8, opacity: 0.6 }}>
              <TaskAltIcon sx={{ fontSize: 60, mb: 2, color: 'divider' }} />
              <Typography variant="h6">No tasks found</Typography>
              <Typography variant="body2">Click "New Task" to get started.</Typography>
            </Box>
          )
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;