import { useEffect, useState } from 'react';
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
  Tooltip,
  Pagination,
  Snackbar,
  TextField,
  MenuItem,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import DashboardCards from './DashboardCards';
import jsonToCsvExport from 'json-to-csv-export';
import SearchComponent from './SearchComponent';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMsg, setAlertMsg] = useState('Task List Updated Successfully!');
  const { items, status, error } = useSelector((state) => state.tasks);
  const { auth } = useSelector((state) => state.auth);
  const [isCSVLoading, setCSVLoading] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);
  const ROW_PER_PAGE = 10;

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (location.state?.message) {
      setAlertMsg(location.state.message);
      setOpenSnackbar(true);
    }
    dispatch(fetchTask());
    //setTaskList(items?.tasksWithOwner || [])
  }, [dispatch, location]);

  //Can I Use 3 useEffect Separation of Concerns?
  //Bit of Concern What Should be Done? --> Doubt

  useEffect(() => {
    if (items?.tasksWithOwner) {
      setTasksList(items.tasksWithOwner);
    }
  }, [items]);

  //const tasksList = items?.tasksWithOwner || [];

  const totalPages = Math.ceil(tasksList.length / ROW_PER_PAGE);
  const paginatedTasks = tasksList.slice(
    (page - 1) * ROW_PER_PAGE,
    page * ROW_PER_PAGE,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleDelete = (data) => dispatch(deleteTask(data));
  const handleEditChanges = (data) => navigate(`/edit/${data}`);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleChangesExport = () => {
    try {
      setCSVLoading(true);
      if (!tasksList || tasksList.length === 0) return;

      const flattedData = tasksList.map((task) => ({
        Title: task.title || '',
        Description: task.description || '',
        Status: task.status || '',
        'Due Date': task.dueDate
          ? dayjs(task.dueDate).format('YYYY-MM-DD')
          : '',
        'Assigned To': task.assignedUserDetails?.email || '',
        'Created Date': task.createdAt?._seconds
          ? dayjs(task.createdAt._seconds * 1000).format('YYYY-MM-DD')
          : '',
        'Updated Date': task.updatedAt
          ? dayjs(task.updatedAt).format('YYYY-MM-DD HH:mm')
          : '',
      }));

      jsonToCsvExport({ data: flattedData, filename: 'Tasks List' });
      setCSVLoading(false);
    } catch (error) {
      setCSVLoading(false);
    }
  };

  useEffect(() => {
    let filtered = items?.tasksWithOwner || [];

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (task) =>
          task.dueDate &&
          dayjs(task.dueDate).format('YYYY-MM-DD') === dateFilter,
      );
    }

    setTasksList(filtered);
    setPage(1);
  }, [statusFilter, dateFilter, items]);

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
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
          onClick={() => navigate('/task/create')}
          sx={{ borderRadius: 2, px: 3, py: 1, boxShadow: 2 }}
        >
          New Task
        </Button>
      </Box>

      <SearchComponent />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          <Box component="span" sx={{ opacity: 0.7 }}>
            Hi,{' '}
          </Box>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {auth?.data?.email}
          </Box>
        </Typography>

        {auth.data.role === 'admin' && (
          <Button
            disabled={isCSVLoading}
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 2, px: 3 }}
            onClick={handleChangesExport}
          >
            {isCSVLoading ? 'Exporting CSV...' : 'Export to CSV / Excel'}
          </Button>
        )}
      </Box>

      {auth.data.role === 'admin' && <DashboardCards />}

      <Box sx={{ display: 'flex', gap: 2, mr: 2,mt:4, flexWrap: 'wrap',justifyContent:"end" }}>
        <TextField
          select
          size="small"
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        <TextField
          type="date"
          size="small"
          label="Filter by Date"
          value={dateFilter}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </Box>

      {status === 'loading' && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 10,
          }}
        >
          <CircularProgress thickness={4} size={50} />
          <Typography sx={{ mt: 2 }} color="text.secondary">
            Fetching your tasks...
          </Typography>
        </Box>
      )}

      {status === 'failed' && (
        <Alert
          severity="error"
          variant="filled"
          sx={{ mb: 4, borderRadius: 2 }}
        >
          {error}
        </Alert>
      )}

      <Container maxWidth="lg" sx={{ mt: 4, mb: 1 }}>
        <Grid container spacing={8} justifyContent={'center'}>
          {status === 'succeeded' && paginatedTasks.length > 0
            ? paginatedTasks.map((task) => (
                <Grid spacing={3} item xs={12} sm={6} md={4} key={task.id}>
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
                        borderColor: 'primary.light',
                      },
                    }}
                  >
                    <CardContent sx={{ pb: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={task.status || 'pending'}
                          size="small"
                          color={getStatusColor(task.status)}
                          sx={{
                            fontWeight: 'bold',
                            textTransform: 'capitalize',
                          }}
                        />
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                          }}
                        >
                          <CalendarMonthIcon sx={{ fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption">
                            {task.dueDate
                              ? dayjs(task.dueDate).format('MMM D, YYYY')
                              : 'No date'}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        gutterBottom
                        noWrap
                      >
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
                          minHeight: '40px',
                        }}
                      >
                        {task.description || 'No description provided.'}
                      </Typography>
                    </CardContent>

                    <CardActions
                      sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}
                    >
                      <Typography
                        variant="caption"
                        color="primary"
                        fontWeight="600"
                      >
                        Assigned to:{' '}
                        {task.assignedUserDetails?.email || 'Unassigned'}
                      </Typography>
                      <Box>
                        <Tooltip title="Edit Task">
                          <IconButton
                            onClick={() => handleEditChanges(task.id)}
                            size="small"
                            color="inherit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Task">
                          <IconButton
                            onClick={() => handleDelete(task.id)}
                            size="small"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            : status === 'succeeded' && (
                <Box
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    mt: 8,
                    opacity: 0.6,
                  }}
                >
                  <TaskAltIcon sx={{ fontSize: 60, mb: 2, color: 'divider' }} />
                  <Typography variant="h6">No tasks found</Typography>
                  <Typography variant="body2">
                    Click "New Task" to get started.
                  </Typography>
                </Box>
              )}
        </Grid>

        {tasksList.length > ROW_PER_PAGE && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Container>
  );
}

export default Dashboard;
