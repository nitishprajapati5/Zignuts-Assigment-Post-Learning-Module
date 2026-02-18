import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../Utils/axios';
import { addTask, resetTaskStatus } from '../Store/TaskSlice/taskSlice';

function AddTask() {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.tasks);
  const [users, setUsers] = useState([]);

  const { handleSubmit, register, control, formState: { errors }, reset } = useForm({
    defaultValues: {
      title: '',
      description: '',
      status: 'pending',
      dueDate: null,
      assignedTo: '',
    },
  });

  // Fetch users for the dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await axiosInstance.get("/api/users", { withCredentials: true });
        setUsers(resp.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Handle Success Side Effects
  useEffect(() => {
    if (status === 'succeeded') {
      reset()
    }
  }, [status, reset, dispatch]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : null
    };
    dispatch(addTask(payload));
    
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Card sx={{ minWidth: 450, p: 2, boxShadow: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Typography variant="h5" fontWeight="bold">Create New Task</Typography>

            {status === "failed" && (
              <Alert severity="error">{error || "Task Creation Failed!"}</Alert>
            )}

            <TextField
              label="Title"
              fullWidth
              {...register('title', { required: 'Task title is required' })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Status" fullWidth>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </TextField>
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dueDate"
                control={control}
                rules={{ required: 'Due date is required' }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label="Due Date"
                    minDate={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dueDate,
                        helperText: errors.dueDate?.message,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              select
              label="Assign To"
              fullWidth
              defaultValue="" 
              {...register('assignedTo', { required: 'Assigned user is required' })}
              error={!!errors.assignedTo}
              helperText={errors.assignedTo?.message}
            >
              {users.map((user) => (
                <MenuItem key={user.id || user._id} value={user.id || user._id}>
                  {user.name || user.email}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={status === 'loading'}
              startIcon={status === 'loading' && <CircularProgress size={20} color="inherit" />}
            >
              {status === 'loading' ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AddTask;